import express from 'express';
import { loginUser, registerUser, adminLogin, getUserProfile } from '../controllors/userControllor.js';
import authUser from '../middleware/userAuth.js';
import { myProducts } from '../controllors/productControllor.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/admin', adminLogin)
userRouter.get('/profile', authUser, getUserProfile);
userRouter.get('/my-product',authUser, myProducts)

export default userRouter;