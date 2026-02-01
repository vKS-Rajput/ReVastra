import { Hono } from 'hono';
import { generateId, createToken, authUser, hashPassword, verifyPassword } from '../middleware/auth.js';
import * as jose from 'jose';

const app = new Hono();

// Validate email format
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Register user
app.post('/register', async (c) => {
    try {
        const { name, email, password } = await c.req.json();

        if (!name || !email || !password) {
            return c.json({ success: false, message: 'All fields are required' }, 400);
        }

        if (!isValidEmail(email)) {
            return c.json({ success: false, message: 'Please enter a valid email' }, 400);
        }

        if (password.length < 6) {
            return c.json({ success: false, message: 'Please enter a strong password' }, 400);
        }

        // Check if user exists
        const existing = await c.env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first();
        if (existing) {
            return c.json({ success: false, message: 'User already exists' }, 400);
        }

        const id = generateId();
        const hashedPassword = await hashPassword(password);
        const sellerProfile = JSON.stringify({
            shopName: "", shopDescription: "", bankingInfo: {}, address: {},
            isVerified: false, verificationDate: null, totalRentals: 0,
            avgResponseTime: 0, memberSince: new Date().toISOString(),
            rating: { average: 0, count: 0 }
        });

        await c.env.DB.prepare(
            `INSERT INTO users (id, name, email, password, seller_profile) VALUES (?, ?, ?, ?, ?)`
        ).bind(id, name, email, hashedPassword, sellerProfile).run();

        const token = await createToken(id, c.env.JWT_SECRET);
        const user = { id, name, email, is_seller: 0, seller_profile: JSON.parse(sellerProfile) };

        return c.json({ success: true, token, user });
    } catch (error) {
        console.error('Register error:', error);
        return c.json({ success: false, message: error.message }, 500);
    }
});

// Login user
app.post('/login', async (c) => {
    try {
        const { email, password } = await c.req.json();

        const user = await c.env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email).first();
        if (!user) {
            return c.json({ success: false, message: 'User does not exist. Please register.' }, 400);
        }

        const isValid = await verifyPassword(password, user.password);
        if (!isValid) {
            return c.json({ success: false, message: 'Invalid Credentials' }, 400);
        }

        const token = await createToken(user.id, c.env.JWT_SECRET);
        delete user.password;
        user.seller_profile = JSON.parse(user.seller_profile || '{}');
        user.address = JSON.parse(user.address || '{}');
        user.cart_data = JSON.parse(user.cart_data || '{}');

        return c.json({ success: true, token, user });
    } catch (error) {
        console.error('Login error:', error);
        return c.json({ success: false, message: error.message }, 500);
    }
});

// Admin login
app.post('/admin', async (c) => {
    try {
        const { email, password } = await c.req.json();

        if (email === c.env.ADMIN_EMAIL && password === c.env.ADMIN_PASSWORD) {
            const secretKey = new TextEncoder().encode(c.env.JWT_SECRET);
            const token = await new jose.SignJWT({})
                .setProtectedHeader({ alg: 'HS256' })
                .sign(secretKey);
            return c.json({ success: true, token });
        }

        return c.json({ success: false, message: 'Invalid Credentials' });
    } catch (error) {
        return c.json({ success: false, message: error.message }, 500);
    }
});

// Get user profile
app.get('/profile', authUser, async (c) => {
    try {
        const userId = c.get('userId');
        const user = await c.env.DB.prepare(
            'SELECT id, name, email, phone, address, cart_data, is_seller, seller_profile, is_banned, ban_reason, created_at FROM users WHERE id = ?'
        ).bind(userId).first();

        if (!user) {
            return c.json({ success: false, message: 'User not found' }, 404);
        }

        user.seller_profile = JSON.parse(user.seller_profile || '{}');
        user.address = JSON.parse(user.address || '{}');
        user.cart_data = JSON.parse(user.cart_data || '{}');

        return c.json({ success: true, user });
    } catch (error) {
        return c.json({ success: false, message: error.message }, 500);
    }
});

// Update user profile
app.post('/update', authUser, async (c) => {
    try {
        const userId = c.get('userId');
        const { name, phone, address } = await c.req.json();

        const updates = [];
        const values = [];

        if (name) { updates.push('name = ?'); values.push(name); }
        if (phone) { updates.push('phone = ?'); values.push(phone); }
        if (address) { updates.push('address = ?'); values.push(JSON.stringify(address)); }

        if (updates.length > 0) {
            values.push(userId);
            await c.env.DB.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).bind(...values).run();
        }

        const user = await c.env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(userId).first();
        delete user.password;
        user.seller_profile = JSON.parse(user.seller_profile || '{}');
        user.address = JSON.parse(user.address || '{}');

        return c.json({ success: true, message: 'Profile updated successfully.', user });
    } catch (error) {
        return c.json({ success: false, message: error.message }, 500);
    }
});

// Apply for seller
app.post('/apply-seller', authUser, async (c) => {
    try {
        const userId = c.get('userId');
        const { shopName, shopDescription, bankingInfo, address } = await c.req.json();

        if (!shopName || !bankingInfo || !address) {
            return c.json({ success: false, message: 'Missing required seller details.' }, 400);
        }

        const sellerProfile = JSON.stringify({
            shopName, shopDescription: shopDescription || "",
            bankingInfo, address, isVerified: false, verificationDate: null,
            totalRentals: 0, avgResponseTime: 0, memberSince: new Date().toISOString(),
            rating: { average: 0, count: 0 }
        });

        await c.env.DB.prepare('UPDATE users SET is_seller = 1, seller_profile = ? WHERE id = ?')
            .bind(sellerProfile, userId).run();

        const user = await c.env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(userId).first();
        delete user.password;
        user.seller_profile = JSON.parse(user.seller_profile || '{}');

        return c.json({ success: true, message: 'Congratulations! You are now a seller. 🚀', user });
    } catch (error) {
        return c.json({ success: false, message: error.message }, 500);
    }
});

// Get all sellers (admin)
app.post('/sellers', async (c) => {
    try {
        const { results } = await c.env.DB.prepare(
            'SELECT id, name, email, phone, is_seller, seller_profile, is_banned, ban_reason, created_at FROM users WHERE is_seller = 1'
        ).all();

        const sellers = results.map(s => ({
            ...s,
            seller_profile: JSON.parse(s.seller_profile || '{}')
        }));

        return c.json({ success: true, sellers });
    } catch (error) {
        return c.json({ success: false, message: error.message }, 500);
    }
});

// Ban seller (admin)
app.post('/ban', async (c) => {
    try {
        const { userId, isBanned, banReason } = await c.req.json();

        await c.env.DB.prepare('UPDATE users SET is_banned = ?, ban_reason = ? WHERE id = ?')
            .bind(isBanned ? 1 : 0, isBanned ? banReason : '', userId).run();

        return c.json({ success: true, message: isBanned ? 'Seller banned successfully.' : 'Seller unbanned successfully.' });
    } catch (error) {
        return c.json({ success: false, message: error.message }, 500);
    }
});

// Verify seller (admin)
app.post('/verify', async (c) => {
    try {
        const { userId, isVerified } = await c.req.json();

        const user = await c.env.DB.prepare('SELECT seller_profile FROM users WHERE id = ? AND is_seller = 1').bind(userId).first();
        if (!user) {
            return c.json({ success: false, message: 'Seller not found.' }, 404);
        }

        const sellerProfile = JSON.parse(user.seller_profile || '{}');
        sellerProfile.isVerified = isVerified;
        if (isVerified) sellerProfile.verificationDate = new Date().toISOString();

        await c.env.DB.prepare('UPDATE users SET seller_profile = ? WHERE id = ?')
            .bind(JSON.stringify(sellerProfile), userId).run();

        return c.json({ success: true, message: isVerified ? 'Seller verified successfully! ✓' : 'Seller verification removed.' });
    } catch (error) {
        return c.json({ success: false, message: error.message }, 500);
    }
});

export default app;
