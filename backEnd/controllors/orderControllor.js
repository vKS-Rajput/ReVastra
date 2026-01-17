import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
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
    const { userId, amount, items, address, washingFee, deliveryFee } = req.body;


    // Ensure required fields are present
    if (!userId || !amount || !items || !address) {
      return res.json({ success: false, message: "All fields are required." });
    }

    const orderData = {
      userId,
      address,
      amount,
      items,
      washingFee, // Ensure washing fee is included
      deliveryFee, // Ensure delivery fee is included
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

    const orders = await orderModel.find({ userId }).select("amount items washingFee deliveryFee paymentMethod date status payment");
    res.json({ success: true, orders });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// User Earning Data for Frontend - Shows earnings from rentals of user's products
const userEarning = async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId;

    if (!userId) {
      return res.json({ success: false, message: "User ID is required." });
    }

    // Import productModel to find user's products
    const productModel = (await import("../models/productmodel.js")).default;

    // Get all products owned by this user
    const userProducts = await productModel.find({ userId }).select('_id name rental_price');
    const productIds = userProducts.map(p => p._id.toString());

    if (productIds.length === 0) {
      return res.json({
        success: true,
        earnings: [],
        summary: {
          totalEarnings: "0.00",
          pendingEarnings: "0.00",
          completedEarnings: "0.00",
          totalOrders: 0
        }
      });
    }

    // Get all orders that contain these products
    const allOrders = await orderModel.find({});

    let earnings = [];
    let totalEarnings = 0;
    let pendingEarnings = 0;
    let completedEarnings = 0;

    allOrders.forEach(order => {
      order.items.forEach(item => {
        if (productIds.includes(item._id)) {
          const itemDuration = item.duration || 1;
          const itemRentalPrice = item.rental_price || 0;
          const itemEarning = itemRentalPrice * itemDuration;
          const platformCharge = itemEarning * 0.15; // 15% platform fee
          const netEarning = itemEarning - platformCharge;

          earnings.push({
            orderId: order._id,
            productId: item._id,
            productName: item.name,
            productImage: item.image?.[0] || '',
            size: item.size,
            duration: itemDuration,
            grossAmount: itemEarning,
            platformFee: platformCharge.toFixed(2),
            netEarning: netEarning.toFixed(2),
            status: order.status || 'Processing',
            orderDate: order.date,
            buyerAddress: order.address
          });

          totalEarnings += netEarning;
          if (order.status === 'Delivered') {
            completedEarnings += netEarning;
          } else {
            pendingEarnings += netEarning;
          }
        }
      });
    });

    // Sort by date (newest first)
    earnings.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

    res.json({
      success: true,
      earnings,
      summary: {
        totalEarnings: totalEarnings.toFixed(2),
        pendingEarnings: pendingEarnings.toFixed(2),
        completedEarnings: completedEarnings.toFixed(2),
        totalOrders: earnings.length
      }
    });
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

export { placeOrder, allOrders, updateStatus, userOrder, userEarning };
