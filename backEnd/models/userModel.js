import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cartData: { type: Object, default: {} },
  
  // 🚀 New Fields for Identity Verification
  verificationDocument: { type: String, default: null }, // File path of uploaded document
  verificationStatus: { 
    type: String, 
    enum: ["Not Submitted", "Pending", "Verified", "Rejected"], 
    default: "Not Submitted" 
  },
}, { minimize: false });

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;
