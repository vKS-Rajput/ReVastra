import express from 'express'
import { placeOrder, allOrders, userOrder, updateStatus, userEarning, getSellerOrders } from '../controllors/orderControllor.js'
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/userAuth.js'

const orderRouter = express.Router()

// Admin Features
orderRouter.post('/list', adminAuth, allOrders)
orderRouter.post('/status', adminAuth, updateStatus)

// Payment Features
orderRouter.post('/place', authUser, placeOrder)

// orderRouter.post('/razorpay',authUser,placeOrderRazorpay)

// User Feature 
orderRouter.post('/userorders', authUser, userOrder)

// User Earning
orderRouter.post('/my_earning', authUser, userEarning)

// Seller Incoming Orders (Sanitized)
orderRouter.post('/seller-orders', authUser, getSellerOrders)

// verify payment

// orderRouter.post('/verifyRazorpay',authUser, verifyRazorpay)

export default orderRouter