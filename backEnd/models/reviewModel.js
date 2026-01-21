import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'order',
        required: true
    },
    reviewerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    // Main rating (1-5)
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    // Sub-ratings for detailed feedback
    subRatings: {
        itemCondition: { type: Number, min: 1, max: 5 },
        communication: { type: Number, min: 1, max: 5 },
        onTimeDelivery: { type: Number, min: 1, max: 5 }
    },
    comment: {
        type: String,
        maxLength: 500
    },
    // Review metadata
    isAnonymous: { type: Boolean, default: false },
    helpfulCount: { type: Number, default: 0 },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Prevent duplicate reviews for same order
reviewSchema.index({ orderId: 1, reviewerId: 1 }, { unique: true });

const reviewModel = mongoose.models.review || mongoose.model('review', reviewSchema);

export default reviewModel;
