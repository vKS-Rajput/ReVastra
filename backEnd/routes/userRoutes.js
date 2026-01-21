import express from 'express';
import { loginUser, registerUser, adminLogin, getUserProfile, applyForSeller, getAllSellers, banSeller, updateUserProfile, verifySeller } from '../controllors/userControllor.js';
import authUser from '../middleware/userAuth.js';
import adminAuth from '../middleware/adminAuth.js';
import { myProducts } from '../controllors/productControllor.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/admin', adminLogin)
userRouter.get('/profile', authUser, getUserProfile);
userRouter.post('/become-seller', authUser, applyForSeller);
userRouter.get('/sellers', adminAuth, getAllSellers);
userRouter.post('/ban', adminAuth, banSeller);
userRouter.post('/verify', adminAuth, verifySeller); // Verify seller (admin only)
userRouter.put('/update', authUser, updateUserProfile);

export default userRouter;