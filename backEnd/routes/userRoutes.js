import express from 'express';
import { loginUser, registerUser, adminLogin, getUserProfile, applyForSeller, getAllSellers, banSeller, updateUserProfile } from '../controllors/userControllor.js';
import authUser from '../middleware/userAuth.js';
import adminAuth from '../middleware/adminAuth.js'; // Import adminAuth
import { myProducts } from '../controllors/productControllor.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/admin', adminLogin)
userRouter.get('/profile', authUser, getUserProfile);
userRouter.post('/become-seller', authUser, applyForSeller); // Authenticated user applies
userRouter.get('/sellers', adminAuth, getAllSellers); // Protected by adminAuth
userRouter.post('/ban', adminAuth, banSeller);
userRouter.put('/update', authUser, updateUserProfile);

// Correction: Need an admin middleware or just protect via separate admin route file.
// For now, let's use a new middleware or reuse authUser + admin check if available.
// However, looking at productRoute, admin routes usually don't have middleware here or use adminAuth.
// Let's use userAuth for /become-seller. For /sellers, we need adminAuth.

export default userRouter;