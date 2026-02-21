import { Hono } from 'hono';
import { generateId, authUser, adminAuth, checkBanned, sanitizeError } from '../middleware/auth.js';

const app = new Hono();

const URGENT_FEE = 100;

// ── Auth: Place order ──────────────────────────────────────────────
app.post('/place', authUser, checkBanned, async (c) => {
    try {
        const userId = c.get('userId');
        const body = await c.req.json();

        const { amount, items, address, washingFee, deliveryFee, securityDeposit, rentalStartDate, rentalEndDate, deliveryDate, urgentOrder, pricingBreakdown } = body;

        if (!amount || !items || !address) {
            return c.json({ success: false, message: 'All fields are required.' }, 400);
        }

        if (!Array.isArray(items) || items.length === 0) {
            return c.json({ success: false, message: 'Order must contain at least one item.' }, 400);
        }

        if (items.length > 50) {
            return c.json({ success: false, message: 'Too many items in order.' }, 400);
        }

        if (Number(amount) <= 0 || Number(amount) > 10000000) {
            return c.json({ success: false, message: 'Invalid order amount.' }, 400);
        }

        // Validate all items are available
        const unavailableItems = [];
        for (const item of items) {
            if (!item._id) {
                unavailableItems.push({ name: item.name || 'Unknown', reason: 'invalid item' });
                continue;
            }
            const product = await c.env.DB.prepare('SELECT id, name, status, is_active FROM products WHERE id = ?').bind(item._id).first();
            if (!product || product.is_active !== 1) {
                unavailableItems.push({ name: item.name || 'Unknown Product', reason: 'not found' });
            } else if (product.status !== 'available') {
                unavailableItems.push({ name: product.name, reason: 'unavailable' });
            }
        }

        if (unavailableItems.length > 0) {
            const names = unavailableItems.map(i => `"${i.name}"`).join(', ');
            return c.json({
                success: false,
                message: `Cannot place order. The following item(s) are no longer available: ${names}. Please remove them from your cart and try again.`
            }, 400);
        }

        const orderId = generateId();
        const urgentFee = urgentOrder ? URGENT_FEE : 0;

        await c.env.DB.prepare(
            `INSERT INTO orders (id, user_id, amount, address, status, payment_method, payment, washing_fee, delivery_fee, security_deposit, rental_start_date, rental_end_date, delivery_date, urgent_order, urgent_fee, pricing_breakdown)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
            orderId, userId, amount, JSON.stringify(address), 'Order Placed', 'COD', 0,
            washingFee || 0, deliveryFee || 0, securityDeposit || 0,
            rentalStartDate || null, rentalEndDate || null, deliveryDate || null,
            urgentOrder ? 1 : 0, urgentFee,
            pricingBreakdown ? JSON.stringify(pricingBreakdown) : null
        ).run();

        for (const item of items) {
            const itemId = generateId();
            await c.env.DB.prepare(
                `INSERT INTO order_items (id, order_id, product_id, name, image, size, quantity, duration, rental_price)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
            ).bind(
                itemId, orderId, item._id, item.name,
                JSON.stringify(item.image || []), item.size,
                item.quantity || 1, item.duration || 1, item.rental_price || 0
            ).run();
        }

        // Clear cart
        await c.env.DB.prepare('UPDATE users SET cart_data = ? WHERE id = ?').bind('{}', userId).run();

        return c.json({ success: true, message: 'Order Placed Successfully' });
    } catch (error) {
        return c.json({ success: false, message: sanitizeError(error) }, 500);
    }
});

// ── Admin: Get all orders ──────────────────────────────────────────
app.post('/list', adminAuth, async (c) => {
    try {
        const { results: orders } = await c.env.DB.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();

        for (let order of orders) {
            const { results: items } = await c.env.DB.prepare('SELECT * FROM order_items WHERE order_id = ?').bind(order.id).all();
            order.items = items.map(item => ({
                ...item, _id: item.product_id,
                image: JSON.parse(item.image || '[]')
            }));
            order._id = order.id;
            order.address = JSON.parse(order.address || '{}');
            order.date = order.created_at;
        }

        return c.json({ success: true, orders });
    } catch (error) {
        return c.json({ success: false, message: sanitizeError(error) }, 500);
    }
});

// ── Auth: Get user orders ──────────────────────────────────────────
app.post('/userorders', authUser, async (c) => {
    try {
        const userId = c.get('userId');

        const { results: orders } = await c.env.DB.prepare(
            'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC'
        ).bind(userId).all();

        for (let order of orders) {
            const { results: items } = await c.env.DB.prepare('SELECT * FROM order_items WHERE order_id = ?').bind(order.id).all();
            order.items = items.map(item => ({
                ...item, _id: item.product_id,
                image: JSON.parse(item.image || '[]')
            }));
            order._id = order.id;
            order.address = JSON.parse(order.address || '{}');
            order.date = order.created_at;
            order.washingFee = order.washing_fee;
            order.deliveryFee = order.delivery_fee;
        }

        return c.json({ success: true, orders });
    } catch (error) {
        return c.json({ success: false, message: sanitizeError(error) }, 500);
    }
});

// ── Admin: Update order status ─────────────────────────────────────
app.post('/status', adminAuth, async (c) => {
    try {
        const { orderId, status } = await c.req.json();

        if (!orderId || !status) {
            return c.json({ success: false, message: 'Order ID and status are required.' }, 400);
        }

        // Validate status values
        const validStatuses = ['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Returned'];
        if (!validStatuses.includes(status)) {
            return c.json({ success: false, message: 'Invalid order status.' }, 400);
        }

        const order = await c.env.DB.prepare('SELECT id FROM orders WHERE id = ?').bind(orderId).first();
        if (!order) {
            return c.json({ success: false, message: 'Order not found.' }, 404);
        }

        await c.env.DB.prepare('UPDATE orders SET status = ? WHERE id = ?').bind(status, orderId).run();
        return c.json({ success: true, message: 'Status Updated' });
    } catch (error) {
        return c.json({ success: false, message: sanitizeError(error) }, 500);
    }
});

// ── Auth: Get user earnings ────────────────────────────────────────
app.post('/my_earning', authUser, async (c) => {
    try {
        const userId = c.get('userId');

        const { results: userProducts } = await c.env.DB.prepare('SELECT id FROM products WHERE user_id = ?').bind(userId).all();
        const productIds = userProducts.map(p => p.id);

        if (productIds.length === 0) {
            return c.json({
                success: true, earnings: [],
                summary: { totalEarnings: '0.00', pendingEarnings: '0.00', completedEarnings: '0.00', totalOrders: 0 }
            });
        }

        const placeholders = productIds.map(() => '?').join(',');
        const { results: orderItems } = await c.env.DB.prepare(
            `SELECT oi.*, o.status, o.created_at as order_date, o.address 
             FROM order_items oi 
             JOIN orders o ON oi.order_id = o.id 
             WHERE oi.product_id IN (${placeholders})`
        ).bind(...productIds).all();

        let earnings = [];
        let totalEarnings = 0, pendingEarnings = 0, completedEarnings = 0;

        for (const item of orderItems) {
            const itemDuration = item.duration || 1;
            const itemRentalPrice = item.rental_price || 0;
            const itemEarning = itemRentalPrice * itemDuration;
            const platformCharge = itemEarning * 0.15;
            const netEarning = itemEarning - platformCharge;

            earnings.push({
                orderId: item.order_id, productId: item.product_id,
                productName: item.name,
                productImage: JSON.parse(item.image || '[]')[0] || '',
                size: item.size, duration: itemDuration,
                grossAmount: itemEarning,
                platformFee: platformCharge.toFixed(2),
                netEarning: netEarning.toFixed(2),
                status: item.status || 'Processing',
                orderDate: item.order_date,
                buyerAddress: JSON.parse(item.address || '{}')
            });

            totalEarnings += netEarning;
            if (item.status === 'Delivered') { completedEarnings += netEarning; }
            else { pendingEarnings += netEarning; }
        }

        earnings.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

        return c.json({
            success: true, earnings,
            summary: {
                totalEarnings: totalEarnings.toFixed(2), pendingEarnings: pendingEarnings.toFixed(2),
                completedEarnings: completedEarnings.toFixed(2), totalOrders: earnings.length
            }
        });
    } catch (error) {
        return c.json({ success: false, message: sanitizeError(error) }, 500);
    }
});

// ── Auth: Get seller orders ────────────────────────────────────────
app.post('/seller-orders', authUser, async (c) => {
    try {
        const userId = c.get('userId');

        const { results: sellerProducts } = await c.env.DB.prepare('SELECT id FROM products WHERE user_id = ?').bind(userId).all();
        const productIds = sellerProducts.map(p => p.id);

        if (productIds.length === 0) {
            return c.json({ success: true, orders: [] });
        }

        const placeholders = productIds.map(() => '?').join(',');
        const { results: orderItems } = await c.env.DB.prepare(
            `SELECT oi.*, o.status, o.payment, o.created_at as order_date 
             FROM order_items oi 
             JOIN orders o ON oi.order_id = o.id 
             WHERE oi.product_id IN (${placeholders})
             ORDER BY o.created_at DESC`
        ).bind(...productIds).all();

        const sellerOrders = orderItems.map(item => ({
            orderId: item.order_id, productName: item.name,
            productImage: JSON.parse(item.image || '[]')[0] || '',
            size: item.size, quantity: item.quantity,
            duration: item.duration || 1, orderDate: item.order_date,
            status: item.status, payment: item.payment,
            message: 'Please pack this item and mark as ready.'
        }));

        return c.json({ success: true, orders: sellerOrders });
    } catch (error) {
        return c.json({ success: false, message: sanitizeError(error) }, 500);
    }
});

export default app;
