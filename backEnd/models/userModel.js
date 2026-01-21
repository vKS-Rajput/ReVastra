import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} },
    phone: { type: String, default: "" },
    address: { type: Object, default: { street: '', city: '', state: '', zip: '' } },
    isSeller: { type: Boolean, default: false },
    sellerProfile: {
        shopName: { type: String, default: "" },
        shopDescription: { type: String, default: "" },
        bankingInfo: { type: Object, default: {} },
        address: { type: Object, default: {} },
        // Verification & Trust System
        isVerified: { type: Boolean, default: false },
        verificationDate: { type: Date },
        totalRentals: { type: Number, default: 0 },
        avgResponseTime: { type: Number, default: 0 }, // in hours
        memberSince: { type: Date, default: Date.now },
        rating: {
            average: { type: Number, default: 0 },
            count: { type: Number, default: 0 }
        }
    },
    isBanned: { type: Boolean, default: false },
    banReason: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now }
}, { minimize: false })

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel