import express from 'express';
import {
    listProduct,
    addProduct,
    removeProduct,
    singleProduct,
    updateProductStatus,
    myProducts,
    removeUserProduct
} from '../controllors/productControllor.js';
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/userAuth.js'

const productRouter = express.Router();

// Admin-only route to add a product
productRouter.post('/add', authUser, upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 }
]), addProduct);

// Admin-only route to remove a product
productRouter.post('/remove', adminAuth, removeProduct);

// Route to get a single product
productRouter.get('/single', singleProduct);

// Route to list products
productRouter.get('/list', listProduct);

// ✅ User route: List products added by the logged-in user
productRouter.get('/my-product', authUser, myProducts)

// ✅ User route: Delete user's own product
productRouter.delete('/my-product/:id', authUser, removeUserProduct);

// Admin-only route to update product status
productRouter.put('/update-status/:id', adminAuth, updateProductStatus);



export default productRouter;
