import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import razorpay from "razorpay";

// Global Variables
const currency = "inr";
const deliveryCharge = 10;

// Razorpay Initialization (if required in future)
// let razorpayInstance;
// if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_SECRET_KEY) {
//   razorpayInstance = new razorpay({
//     key_id: process.env.RAZORPAY_KEY_ID,
//     key_secret: process.env.RAZORPAY_SECRET_KEY,
//   });
// }

// Placing Order Using COD Method
const placeOrder = async (req, res) => {
  try {
    const { userId, amount, items, address } = req.body;

    // Ensure required fields are present
    if (!userId || !amount || !items || !address) {
      return res.json({ success: false, message: "All fields are required." });
    }

    const orderData = {
      userId,
      address,
      amount,
      items,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };

    // Save the order
    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // Clear user's cart
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order Placed Successfully" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Orders Data for Admin Panel
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// User Order Data for Frontend
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

// Fetch earnings for a seller
const userEarning = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.json({ success: false, message: "User ID is required." });
    }

    // Fetch orders where the user is the seller
    const orders = await orderModel.find({ "items.sellerId": userId });

    res.json({ success: true, earnings: orders });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Fetch products listed by a user
const myListedProducts = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.json({ success: false, message: "User ID is required." });
    }

    // Fetch all products where the user is the owner
    const products = await productModel.find({ owner: userId });

    res.json({ success: true, products });
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

export { placeOrder, allOrders, updateStatus, userOrder, userEarning, myListedProducts };
