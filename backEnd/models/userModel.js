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
        bankingInfo: { type: Object, default: {} }, // { upiId, accountNo, ifsc }
        address: { type: Object, default: {} } // { street, city, state, zip }
    },
    isBanned: { type: Boolean, default: false },
    banReason: { type: String, default: "" }
}, { minimize: false })

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel