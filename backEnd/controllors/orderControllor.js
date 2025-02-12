import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// Global Variables
const currency = "inr";
const deliveryCharge = 10;

// Placing Order for Rented Products (COD Method)
const placeOrder = async (req, res) => {
    try {
        const { userId, amount, items, address } = req.body;

        // Ensure required fields are present
        if (!userId || !amount || !items || !address) {
            return res.json({ success: false, message: "All fields are required." });
        }

        // Modify order data to track lender information
        const orderData = items.map(item => ({
            userId, // Buyer ID
            lenderId: item.lenderId, // Lender ID (person who listed the product)
            productId: item.productId,
            address,
            amount: item.rental_price,
            paymentMethod: "COD",
            payment: false,
            date: Date.now(),
            status: "Pending" // Default status
        }));

        // Save orders
        await orderModel.insertMany(orderData);

        // Clear user's cart
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        res.json({ success: true, message: "Order Placed Successfully" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Fetch Orders for Lender (Earnings Page)
const myEarnings = async (req, res) => {
    try {
        const { lenderId } = req.body;

        if (!lenderId) {
            return res.json({ success: false, message: "Lender ID is required." });
        }

        // Find all orders where the lender is the logged-in user
        const orders = await orderModel.find({ lenderId });

        res.json({ success: true, orders });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Fetch Orders for Admin Panel
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, orders });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Fetch Orders for User (Who Rented Products)
const userOrder = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.json({ success: false, message: "User ID is required." });
        }

        const orders = await orderModel.find({ userId });
        res.json({ success: true, orders });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Update Order Status from Admin Panel
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        if (!orderId || !status) {
            return res.json({ success: false, message: "Order ID and status are required." });
        }

        await orderModel.findByIdAndUpdate(orderId, { status });
        res.json({ success: true, message: "Status Updated" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

export { placeOrder, allOrders, updateStatus, userOrder, myEarnings };
