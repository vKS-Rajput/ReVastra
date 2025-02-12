import express from 'express';
import { placeOrder, allOrders, userOrder, updateStatus, userEarning } from '../controllors/orderControllor.js';
import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/userAuth.js';

const orderRouter = express.Router();

// Admin Features
orderRouter.post('/list', adminAuth, allOrders);
orderRouter.post('/status', adminAuth, updateStatus);

// Payment Features
orderRouter.post('/place', authUser, placeOrder);

// User Features
orderRouter.post('/userorders', authUser, userOrder);

// New API - Fetch earnings for a lender
orderRouter.post('/user-earnings', authUser, userEarning);

export default orderRouter;
