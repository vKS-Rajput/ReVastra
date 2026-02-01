import { Hono } from 'hono';
import { generateId, authUser } from '../middleware/auth.js';

const app = new Hono();

// List all products
app.get('/list', async (c) => {
    try {
        // Get banned user IDs
        const { results: bannedUsers } = await c.env.DB.prepare('SELECT id FROM users WHERE is_banned = 1').all();
        const bannedIds = bannedUsers.map(u => u.id);

        // Get all products
        let products;
        if (bannedIds.length > 0) {
            const placeholders = bannedIds.map(() => '?').join(',');
            const { results } = await c.env.DB.prepare(
                `SELECT * FROM products WHERE user_id NOT IN (${placeholders})`
            ).bind(...bannedIds).all();
            products = results;
        } else {
            const { results } = await c.env.DB.prepare('SELECT * FROM products').all();
            products = results;
        }

        // Get unique seller IDs
        const sellerIds = [...new Set(products.map(p => p.user_id))];

        // Fetch seller info
        let sellerMap = {};
        if (sellerIds.length > 0) {
            const placeholders = sellerIds.map(() => '?').join(',');
            const { results: sellers } = await c.env.DB.prepare(
                `SELECT id, name, seller_profile FROM users WHERE id IN (${placeholders})`
            ).bind(...sellerIds).all();

            sellers.forEach(s => {
                const profile = JSON.parse(s.seller_profile || '{}');
                sellerMap[s.id] = {
                    name: s.name,
                    shopName: profile.shopName || s.name,
                    isVerified: profile.isVerified || false,
                    rating: profile.rating || { average: 0, count: 0 },
                    totalRentals: profile.totalRentals || 0
                };
            });
        }

        // Map products with seller info
        const productsWithSeller = products.map(p => ({
            ...p,
            _id: p.id,
            image: JSON.parse(p.image || '[]'),
            sizes: JSON.parse(p.sizes || '[]'),
            seller: sellerMap[p.user_id] || null
        }));

        return c.json({ success: true, products: productsWithSeller });
    } catch (error) {
        console.error('List products error:', error);
        return c.json({ success: false, message: error.message }, 500);
    }
});

// Get single product
app.get('/single/:productId', async (c) => {
    try {
        const productId = c.req.param('productId');
        const product = await c.env.DB.prepare('SELECT * FROM products WHERE id = ?').bind(productId).first();

        if (!product) {
            return c.json({ success: false, message: 'Product not found.' }, 404);
        }

        // Get seller info
        const seller = await c.env.DB.prepare(
            'SELECT id, name, seller_profile, created_at FROM users WHERE id = ?'
        ).bind(product.user_id).first();

        const profile = seller ? JSON.parse(seller.seller_profile || '{}') : {};
        const sellerInfo = seller ? {
            _id: seller.id,
            name: seller.name,
            shopName: profile.shopName || seller.name,
            isVerified: profile.isVerified || false,
            rating: profile.rating || { average: 0, count: 0 },
            totalRentals: profile.totalRentals || 0,
            memberSince: profile.memberSince || seller.created_at
        } : null;

        return c.json({
            success: true,
            product: {
                ...product,
                _id: product.id,
                image: JSON.parse(product.image || '[]'),
                sizes: JSON.parse(product.sizes || '[]'),
                seller: sellerInfo
            }
        });
    } catch (error) {
        return c.json({ success: false, message: error.message }, 500);
    }
});

// Add product (requires auth)
app.post('/add', authUser, async (c) => {
    try {
        const userId = c.get('userId');
        const body = await c.req.json();

        const { name, price, description, rental_price, category, subCategory, sizes, contactno, pickuplocation, bestSeller, images } = body;

        if (!name || !description || !price || !category || !sizes || !rental_price || !contactno || !pickuplocation) {
            return c.json({ success: false, message: 'All required fields must be provided.' }, 400);
        }

        const id = generateId();
        const parsedSizes = Array.isArray(sizes) ? sizes : JSON.parse(sizes);
        const imageArray = Array.isArray(images) ? images : [images];

        await c.env.DB.prepare(
            `INSERT INTO products (id, user_id, name, description, price, rental_price, image, category, sub_category, sizes, best_seller, pickup_location, contact_no, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
            id, userId, name, description, Number(price), Number(rental_price),
            JSON.stringify(imageArray), category, subCategory || null,
            JSON.stringify(parsedSizes), bestSeller ? 1 : 0, pickuplocation, contactno, 'available'
        ).run();

        const product = await c.env.DB.prepare('SELECT * FROM products WHERE id = ?').bind(id).first();
        product.image = JSON.parse(product.image || '[]');
        product.sizes = JSON.parse(product.sizes || '[]');
        product._id = product.id;

        return c.json({ success: true, message: 'Product added successfully', product });
    } catch (error) {
        console.error('Add product error:', error);
        return c.json({ success: false, message: error.message }, 500);
    }
});

// Get user's products
app.post('/myproducts', authUser, async (c) => {
    try {
        const userId = c.get('userId');
        const { results } = await c.env.DB.prepare('SELECT * FROM products WHERE user_id = ?').bind(userId).all();

        const products = results.map(p => ({
            ...p,
            _id: p.id,
            image: JSON.parse(p.image || '[]'),
            sizes: JSON.parse(p.sizes || '[]')
        }));

        return c.json({ success: true, products });
    } catch (error) {
        return c.json({ success: false, message: error.message }, 500);
    }
});

// Remove product (admin)
app.post('/remove', async (c) => {
    try {
        const { id } = await c.req.json();

        const product = await c.env.DB.prepare('SELECT id FROM products WHERE id = ?').bind(id).first();
        if (!product) {
            return c.json({ success: false, message: 'Product not found.' }, 404);
        }

        await c.env.DB.prepare('DELETE FROM products WHERE id = ?').bind(id).run();
        return c.json({ success: true, message: 'Product Removed Successfully' });
    } catch (error) {
        return c.json({ success: false, message: error.message }, 500);
    }
});

// Update product status
app.put('/status/:id', authUser, async (c) => {
    try {
        const productId = c.req.param('id');
        const { status } = await c.req.json();

        if (!['available', 'out_of_stock'].includes(status)) {
            return c.json({ success: false, message: 'Invalid status value' }, 400);
        }

        await c.env.DB.prepare('UPDATE products SET status = ? WHERE id = ?').bind(status, productId).run();

        const product = await c.env.DB.prepare('SELECT * FROM products WHERE id = ?').bind(productId).first();
        if (!product) {
            return c.json({ success: false, message: 'Product not found' }, 404);
        }

        product.image = JSON.parse(product.image || '[]');
        product.sizes = JSON.parse(product.sizes || '[]');

        return c.json({ success: true, message: 'Product status updated', product });
    } catch (error) {
        return c.json({ success: false, message: error.message }, 500);
    }
});

// Delete user's own product
app.delete('/user/:id', authUser, async (c) => {
    try {
        const userId = c.get('userId');
        const productId = c.req.param('id');

        const product = await c.env.DB.prepare('SELECT * FROM products WHERE id = ?').bind(productId).first();
        if (!product) {
            return c.json({ success: false, message: 'Product not found.' }, 404);
        }

        if (product.user_id !== userId) {
            return c.json({ success: false, message: 'You can only delete your own products.' }, 403);
        }

        await c.env.DB.prepare('DELETE FROM products WHERE id = ?').bind(productId).run();
        return c.json({ success: true, message: 'Product removed successfully' });
    } catch (error) {
        return c.json({ success: false, message: error.message }, 500);
    }
});

export default app;
