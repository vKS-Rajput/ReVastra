import express from 'express';
import { loginUser, registerUser, adminLogin, getUserProfile } from '../controllors/userControllor.js';
import authUser from '../middleware/userAuth.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/admin', adminLogin)
userRouter.post('/profile',authUser, getUserProfile)

export default userRouter;