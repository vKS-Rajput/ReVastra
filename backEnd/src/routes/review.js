import { Hono } from 'hono';
import { generateId } from '../middleware/auth.js';

const app = new Hono();

// Add review
app.post('/add', async (c) => {
    try {
        const { orderId, rating, subRatings, comment, isAnonymous, userId } = await c.req.json();

        // Check if order exists
        const order = await c.env.DB.prepare('SELECT * FROM orders WHERE id = ?').bind(orderId).first();
        if (!order) {
            return c.json({ success: false, message: 'Order not found' });
        }
        if (order.user_id !== userId) {
            return c.json({ success: false, message: 'Unauthorized' });
        }
        if (order.status !== 'Delivered') {
            return c.json({ success: false, message: 'Can only review after delivery' });
        }

        // Get seller from first item
        const firstItem = await c.env.DB.prepare('SELECT product_id FROM order_items WHERE order_id = ? LIMIT 1').bind(orderId).first();
        if (!firstItem) {
            return c.json({ success: false, message: 'No items found for this order' });
        }

        const product = await c.env.DB.prepare('SELECT user_id FROM products WHERE id = ?').bind(firstItem.product_id).first();
        if (!product) {
            return c.json({ success: false, message: 'Seller not found for this order' });
        }
        const sellerId = product.user_id;

        // Check if already reviewed
        const existing = await c.env.DB.prepare('SELECT id FROM reviews WHERE order_id = ? AND reviewer_id = ?').bind(orderId, userId).first();
        if (existing) {
            return c.json({ success: false, message: 'Already reviewed this order' });
        }

        // Create review
        const reviewId = generateId();
        await c.env.DB.prepare(
            `INSERT INTO reviews (id, order_id, reviewer_id, seller_id, rating, sub_ratings, comment, is_anonymous)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(reviewId, orderId, userId, sellerId, rating, JSON.stringify(subRatings || {}), comment || '', isAnonymous ? 1 : 0).run();

        // Update seller's average rating
        const { results: allReviews } = await c.env.DB.prepare('SELECT rating FROM reviews WHERE seller_id = ?').bind(sellerId).all();
        const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

        const seller = await c.env.DB.prepare('SELECT seller_profile FROM users WHERE id = ?').bind(sellerId).first();
        const sellerProfile = JSON.parse(seller.seller_profile || '{}');
        sellerProfile.rating = { average: Math.round(avgRating * 10) / 10, count: allReviews.length };

        await c.env.DB.prepare('UPDATE users SET seller_profile = ? WHERE id = ?')
            .bind(JSON.stringify(sellerProfile), sellerId).run();

        return c.json({ success: true, message: 'Review submitted successfully' });
    } catch (error) {
        return c.json({ success: false, message: error.message });
    }
});

// Get seller reviews
app.get('/seller/:sellerId', async (c) => {
    try {
        const sellerId = c.req.param('sellerId');

        const { results: reviews } = await c.env.DB.prepare(
            `SELECT r.*, u.name as reviewer_name 
             FROM reviews r 
             LEFT JOIN users u ON r.reviewer_id = u.id 
             WHERE r.seller_id = ? 
             ORDER BY r.created_at DESC 
             LIMIT 20`
        ).bind(sellerId).all();

        const formattedReviews = reviews.map(r => ({
            ...r,
            _id: r.id,
            sub_ratings: JSON.parse(r.sub_ratings || '{}'),
            reviewerName: r.is_anonymous ? 'Anonymous' : r.reviewer_name || 'User'
        }));

        return c.json({ success: true, reviews: formattedReviews });
    } catch (error) {
        return c.json({ success: false, message: error.message });
    }
});

// Check if can review
app.get('/can-review/:orderId', async (c) => {
    try {
        const orderId = c.req.param('orderId');
        const userId = c.req.query('userId');

        const order = await c.env.DB.prepare('SELECT * FROM orders WHERE id = ?').bind(orderId).first();
        if (!order || order.user_id !== userId) {
            return c.json({ success: false, canReview: false });
        }

        const existing = await c.env.DB.prepare('SELECT id FROM reviews WHERE order_id = ? AND reviewer_id = ?').bind(orderId, userId).first();
        const canReview = order.status === 'Delivered' && !existing;

        return c.json({ success: true, canReview, hasReviewed: !!existing });
    } catch (error) {
        return c.json({ success: false, canReview: false });
    }
});

// Get seller profile
app.get('/profile/:sellerId', async (c) => {
    try {
        const sellerId = c.req.param('sellerId');

        const seller = await c.env.DB.prepare(
            'SELECT id, name, seller_profile, is_seller, created_at FROM users WHERE id = ?'
        ).bind(sellerId).first();

        if (!seller || !seller.is_seller) {
            return c.json({ success: false, message: 'Seller not found' });
        }

        const profile = JSON.parse(seller.seller_profile || '{}');
        const rentals = profile.totalRentals || 0;
        let badge = 'new';
        if (rentals >= 50) badge = 'top';
        else if (rentals >= 25) badge = 'popular';
        else if (rentals >= 5) badge = 'rising';

        return c.json({
            success: true,
            seller: {
                _id: seller.id,
                name: seller.name,
                shopName: profile.shopName || seller.name,
                isVerified: profile.isVerified || false,
                verificationDate: profile.verificationDate,
                totalRentals: rentals,
                avgResponseTime: profile.avgResponseTime || 0,
                memberSince: profile.memberSince || seller.created_at,
                rating: profile.rating || { average: 0, count: 0 },
                badge
            }
        });
    } catch (error) {
        return c.json({ success: false, message: error.message });
    }
});

export default app;
