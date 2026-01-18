import express from 'express';
import { getStats } from '../controllors/statsControllor.js';
import adminAuth from '../middleware/adminAuth.js';

const statsRouter = express.Router();

// Admin route to get platform statistics
statsRouter.get('/stats', adminAuth, getStats);

export default statsRouter;
