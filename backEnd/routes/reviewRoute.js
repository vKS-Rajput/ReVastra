import express from 'express';
import { addReview, getSellerReviews, canReview, getSellerProfile } from '../controllors/reviewControllor.js';
import authUser from '../middleware/auth.js';

const reviewRouter = express.Router();

// Protected routes (require authentication)
reviewRouter.post('/add', authUser, addReview);
reviewRouter.get('/can-review/:orderId', authUser, canReview);

// Public routes
reviewRouter.get('/seller/:sellerId', getSellerReviews);
reviewRouter.get('/seller-profile/:sellerId', getSellerProfile);

export default reviewRouter;
