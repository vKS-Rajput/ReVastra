import express from 'express';
import { loginUser, registerUser, adminLogin, getUserProfile, getDashboardStats } from '../controllors/userControllor.js';
import authUser from '../middleware/userAuth.js';
import adminAuth from '../middleware/adminAuth.js';  // 🆕 Import admin middleware

const userRouter = express.Router();

userRouter.post('/register', registerUser);         // User Registration
userRouter.post('/login', loginUser);               // User Login
userRouter.post('/admin', adminLogin);              // Admin Login
userRouter.get('/profile', authUser, getUserProfile); // Get User Profile

// 🆕 Admin Dashboard Stats Route (Protected by adminAuth)
userRouter.get('/stats', getDashboardStats);

export default userRouter;
