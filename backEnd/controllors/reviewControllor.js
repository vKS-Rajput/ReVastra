import reviewModel from "../models/reviewModel.js";
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";

// Add a review for a seller
const addReview = async (req, res) => {
    try {
        const { orderId, rating, subRatings, comment, isAnonymous } = req.body;
        const reviewerId = req.body.userId;

        // Check if order exists and belongs to user
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }
        if (order.userId.toString() !== reviewerId) {
            return res.json({ success: false, message: "Unauthorized" });
        }
        if (order.status !== "Delivered") {
            return res.json({ success: false, message: "Can only review after delivery" });
        }

        // Get seller from first item in order
        const sellerId = order.items[0]?.sellerId;
        if (!sellerId) {
            return res.json({ success: false, message: "Seller not found for this order" });
        }

        // Check if already reviewed
        const existingReview = await reviewModel.findOne({ orderId, reviewerId });
        if (existingReview) {
            return res.json({ success: false, message: "Already reviewed this order" });
        }

        // Create review
        const review = new reviewModel({
            orderId,
            reviewerId,
            sellerId,
            rating,
            subRatings,
            comment,
            isAnonymous
        });
        await review.save();

        // Update seller's average rating
        const allReviews = await reviewModel.find({ sellerId });
        const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

        await userModel.findByIdAndUpdate(sellerId, {
            'sellerProfile.rating.average': Math.round(avgRating * 10) / 10,
            'sellerProfile.rating.count': allReviews.length
        });

        res.json({ success: true, message: "Review submitted successfully" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Get reviews for a seller
const getSellerReviews = async (req, res) => {
    try {
        const { sellerId } = req.params;
        const reviews = await reviewModel.find({ sellerId })
            .populate('reviewerId', 'name')
            .sort({ createdAt: -1 })
            .limit(20);

        // Hide reviewer names for anonymous reviews
        const formattedReviews = reviews.map(r => ({
            ...r._doc,
            reviewerName: r.isAnonymous ? 'Anonymous' : r.reviewerId?.name || 'User'
        }));

        res.json({ success: true, reviews: formattedReviews });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Check if user can review an order
const canReview = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.body.userId;

        const order = await orderModel.findById(orderId);
        if (!order || order.userId.toString() !== userId) {
            return res.json({ success: false, canReview: false });
        }

        const existingReview = await reviewModel.findOne({ orderId, reviewerId: userId });
        const canReview = order.status === "Delivered" && !existingReview;

        res.json({ success: true, canReview, hasReviewed: !!existingReview });
    } catch (error) {
        res.json({ success: false, canReview: false });
    }
};

// Get seller profile with trust info (public)
const getSellerProfile = async (req, res) => {
    try {
        const { sellerId } = req.params;
        const seller = await userModel.findById(sellerId).select(
            'name sellerProfile.shopName sellerProfile.isVerified sellerProfile.verificationDate ' +
            'sellerProfile.totalRentals sellerProfile.avgResponseTime sellerProfile.memberSince ' +
            'sellerProfile.rating createdAt'
        );

        if (!seller || !seller.isSeller) {
            return res.json({ success: false, message: "Seller not found" });
        }

        // Calculate trust badge
        const rentals = seller.sellerProfile?.totalRentals || 0;
        let badge = 'new';
        if (rentals >= 50) badge = 'top';
        else if (rentals >= 25) badge = 'popular';
        else if (rentals >= 5) badge = 'rising';

        res.json({
            success: true,
            seller: {
                _id: seller._id,
                name: seller.name,
                shopName: seller.sellerProfile?.shopName || seller.name,
                isVerified: seller.sellerProfile?.isVerified || false,
                verificationDate: seller.sellerProfile?.verificationDate,
                totalRentals: rentals,
                avgResponseTime: seller.sellerProfile?.avgResponseTime || 0,
                memberSince: seller.sellerProfile?.memberSince || seller.createdAt,
                rating: seller.sellerProfile?.rating || { average: 0, count: 0 },
                badge
            }
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export { addReview, getSellerReviews, canReview, getSellerProfile };
