import userModel from "../models/userModel.js";

// Add products to user cart with rental duration
const addToCart = async (req, res) => {
    try {
        const { userId, itemId, size, days } = req.body;

        const userData = await userModel.findById(userId);
        let cartData = userData.cartData || {};

        if (!cartData[itemId]) {
            cartData[itemId] = {};
        }

        if (!cartData[itemId][size]) {
            cartData[itemId][size] = { quantity: 1, days: days || 1 };
        } else {
            cartData[itemId][size].quantity += 1;
            cartData[itemId][size].days = days || cartData[itemId][size].days;
        }

        await userModel.findByIdAndUpdate(userId, { cartData });

        res.json({ success: true, message: "Added To Cart" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Update user cart (quantity and days)
const updateCart = async (req, res) => {
    try {
        const { userId, itemId, size, quantity, days } = req.body;

        const userData = await userModel.findById(userId);
        let cartData = userData.cartData || {};

        if (cartData[itemId] && cartData[itemId][size]) {
            cartData[itemId][size].quantity = quantity;
            if (days) cartData[itemId][size].days = days; // Update days if provided
        }

        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: "Cart Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Get user cart data with rental days
const getUserCart = async (req, res) => {
    try {
        const { userId } = req.body;

        const userData = await userModel.findById(userId);
        let cartData = userData.cartData || {};

        res.json({ success: true, cartData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { addToCart, updateCart, getUserCart };
