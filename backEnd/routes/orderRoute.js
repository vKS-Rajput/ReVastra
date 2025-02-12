import express from 'express';
import { 
  placeOrder,  
  allOrders, 
  userOrder, 
  updateStatus, 
  userEarning, 
  myListedProducts 
} from '../controllors/orderControllor.js';

import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/userAuth.js';

const orderRouter = express.Router();

// Admin Features
orderRouter.post('/list', adminAuth, allOrders);
orderRouter.post('/status', adminAuth, updateStatus);

// Payment Features
orderRouter.post('/place', authUser, placeOrder);

// orderRouter.post('/razorpay', authUser, placeOrderRazorpay);

// User Feature 
orderRouter.post('/userorders', authUser, userOrder);

// User Earnings (fix incorrect route name)
orderRouter.post('/user-earnings', authUser, userEarning);

// User's Listed Products
orderRouter.post('/my-listings', authUser, myListedProducts);

// Verify Payment
// orderRouter.post('/verifyRazorpay', authUser, verifyRazorpay);

export default orderRouter;
