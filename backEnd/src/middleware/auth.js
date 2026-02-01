import * as jose from 'jose';

// Generate UUID
export function generateId() {
    return crypto.randomUUID();
}

// Create JWT token
export async function createToken(id, secret) {
    const secretKey = new TextEncoder().encode(secret);
    const token = await new jose.SignJWT({ id })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('1d')
        .sign(secretKey);
    return token;
}

// Verify JWT token
export async function verifyToken(token, secret) {
    try {
        const secretKey = new TextEncoder().encode(secret);
        const { payload } = await jose.jwtVerify(token, secretKey);
        return payload;
    } catch (error) {
        return null;
    }
}

// Auth middleware for user routes
export async function authUser(c, next) {
    const authHeader = c.req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return c.json({ success: false, message: 'Not Authorized. Login Again.' }, 401);
    }

    const token = authHeader.split(' ')[1];
    const payload = await verifyToken(token, c.env.JWT_SECRET);

    if (!payload) {
        return c.json({ success: false, message: 'Invalid token' }, 401);
    }

    c.set('userId', payload.id);
    await next();
}

// Admin auth middleware
export async function adminAuth(c, next) {
    const token = c.req.header('token');

    if (!token) {
        return c.json({ success: false, message: 'Not Authorized. Login Again.' }, 401);
    }

    try {
        const expectedToken = c.env.ADMIN_EMAIL + c.env.ADMIN_PASSWORD;
        const secretKey = new TextEncoder().encode(c.env.JWT_SECRET);
        const { payload } = await jose.jwtVerify(token, secretKey);

        // For admin, we just verify the token is valid
        await next();
    } catch (error) {
        return c.json({ success: false, message: 'Invalid token' }, 401);
    }
}

// Hash password using Web Crypto API (bcrypt alternative for Workers)
export async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'revastra_salt_2024');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Verify password
export async function verifyPassword(password, hash) {
    const computedHash = await hashPassword(password);
    return computedHash === hash;
}
