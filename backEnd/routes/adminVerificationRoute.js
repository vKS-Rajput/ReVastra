import express from "express";
import userModel from "../models/userModel.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

// 🚀 Approve User Verification
router.put("/approve/:userId", adminAuth, async (req, res) => {
  try {
    const user = await userModel.findById(req.params.userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (user.verificationStatus !== "Pending") {
      return res.status(400).json({ success: false, message: "No pending verification to approve" });
    }

    user.verificationStatus = "Approved";
    await user.save();

    res.json({ success: true, message: "Verification approved" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 🚫 Reject User Verification
router.put("/reject/:userId", adminAuth, async (req, res) => {
  try {
    const user = await userModel.findById(req.params.userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (user.verificationStatus !== "Pending") {
      return res.status(400).json({ success: false, message: "No pending verification to reject" });
    }

    user.verificationStatus = "Rejected";
    await user.save();

    res.json({ success: true, message: "Verification rejected" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
