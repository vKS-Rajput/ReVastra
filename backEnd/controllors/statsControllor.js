import userModel from "../models/userModel.js";
import productModel from "../models/productmodel.js";
import orderModel from "../models/orderModel.js";

// Get platform statistics for admin dashboard
const getStats = async (req, res) => {
    try {
        const [usersCount, productsCount, ordersCount] = await Promise.all([
            userModel.countDocuments({}),
            productModel.countDocuments({}),
            orderModel.countDocuments({})
        ]);

        // Get additional stats
        const deliveredOrders = await orderModel.countDocuments({ status: 'Delivered' });
        const pendingOrders = await orderModel.countDocuments({ status: { $ne: 'Delivered' } });

        // Calculate total revenue
        const revenueResult = await orderModel.aggregate([
            { $group: { _id: null, totalRevenue: { $sum: "$amount" } } }
        ]);
        const totalRevenue = revenueResult[0]?.totalRevenue || 0;

        res.json({
            success: true,
            stats: {
                users: usersCount,
                products: productsCount,
                orders: ordersCount,
                deliveredOrders,
                pendingOrders,
                totalRevenue
            }
        });
    } catch (error) {
        console.error("Error fetching stats:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export { getStats };
