import { Hono } from 'hono';
import { cors } from 'hono/cors';
import userRoutes from './routes/user.js';
import productRoutes from './routes/product.js';
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/order.js';
import reviewRoutes from './routes/review.js';
import statsRoutes from './routes/stats.js';

const app = new Hono();

// CORS middleware
app.use('*', cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
}));

// Health check
app.get('/', (c) => c.json({ message: 'ReVastra API Working', status: 'ok' }));

// API routes
app.route('/api/user', userRoutes);
app.route('/api/product', productRoutes);
app.route('/api/cart', cartRoutes);
app.route('/api/order', orderRoutes);
app.route('/api/review', reviewRoutes);
app.route('/api', statsRoutes);

// 404 handler
app.notFound((c) => c.json({ success: false, message: 'Route not found' }, 404));

// Error handler
app.onError((err, c) => {
    console.error('Error:', err);
    return c.json({ success: false, message: err.message }, 500);
});

export default app;
