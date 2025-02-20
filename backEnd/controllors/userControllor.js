import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ✅ Token Creation Utility
const createToken = (id, role = "user") => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not set in environment variables");
  }
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// 🚀 Route: User Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "User does not exist. Please register." });
    }

    const isPassMatch = await bcrypt.compare(password, user.password);
    if (!isPassMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const token = createToken(user._id);
    res.status(200).json({ success: true, token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🚀 Route: User Registration
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (await userModel.findOne({ email })) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    const hashPassword = await bcrypt.hash(password, await bcrypt.genSalt(7));
    const newUser = new userModel({ name, email, password: hashPassword });
    const user = await newUser.save();

    const token = createToken(user._id);
    res.status(201).json({ success: true, token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Registration failed" });
  }
};

// 🚀 Route: Upload Verification Document
const userDocumentVerification = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    user.verificationDocument = req.file.path.replace(/^uploads\//, ""); // Save relative path
    user.verificationStatus = "Pending";
    await user.save();

    res.json({ success: true, message: "Document uploaded successfully. Verification pending." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
};

// 🚀 Route: Get User Profile
const getUserProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Could not fetch profile" });
  }
};

// 🚀 Route: Admin Login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = createToken("admin", "admin"); // Clearly marks as admin token
      return res.json({ success: true, token });
    }

    res.status(401).json({ success: false, message: "Invalid credentials" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Admin login failed" });
  }
};

export { loginUser, registerUser, adminLogin, getUserProfile, userDocumentVerification };
