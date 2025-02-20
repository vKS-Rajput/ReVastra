import express from 'express';
import { loginUser, registerUser, adminLogin, getUserProfile, userDocumentVerification } from '../controllors/userControllor.js';
import authUser from '../middleware/userAuth.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/admin', adminLogin)
userRouter.get('/profile', authUser, getUserProfile);
userRouter.post('/verification', authUser, userDocumentVerification)

export default userRouter;