import express from 'express'
import { listProduct, addProduct, removeProduct, singleProduct } from '../controllors/productControllor.js'
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';

const productRouter = express.Router();

// Admin-only route to add a product
productRouter.post('/add', adminAuth, upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }, { name: 'image3', maxCount: 1 }, { name: 'image4', maxCount: 1 }]), addProduct);

// Admin-only route to remove a product
productRouter.post('/remove', adminAuth, removeProduct);

// Route to get a single product (GET instead of POST for better RESTful design)
productRouter.get('/single', singleProduct);

// Route to list products
productRouter.get('/list', listProduct);

// Authenticated user route to lend a product
productRouter.post('/lend', upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }, { name: 'image3', maxCount: 1 }, { name: 'image4', maxCount: 1 }]), addProduct);

export default productRouter;
