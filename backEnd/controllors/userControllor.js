import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import orderModel from "../models/orderModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Create Token Function
const createToken = (id) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not set in environment variables");
    }
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// 📝 User Login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) return res.status(400).json({ success: false, message: "User does not exist." });

        const isPassMatch = await bcrypt.compare(password, user.password);
        if (isPassMatch) {
            const token = createToken(user._id);
            res.status(200).json({ success: true, token, user });
        } else {
            res.status(400).json({ success: false, message: "Invalid Credentials" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 📝 User Registration
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExist = await userModel.findOne({ email });
        if (userExist) return res.status(400).json({ success: false, message: "User already exists" });

        if (!validator.isEmail(email)) return res.status(400).json({ success: false, message: "Invalid email" });
        if (password.length < 6) return res.status(400).json({ success: false, message: "Weak password" });

        const hashPassword = await bcrypt.hash(password, await bcrypt.genSalt(7));
        const newUser = await new userModel({ name, email, password: hashPassword }).save();
        const token = createToken(newUser._id);

        res.status(201).json({ success: true, token, user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 📝 Get User Profile
const getUserProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 📝 Admin Login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ email }, process.env.JWT_SECRET);
            res.json({ success: true, token });
        } else {
            res.status(400).json({ success: false, message: "Invalid Credentials" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 🚀 NEW: Get Dashboard Counts
const getDashboardStats = async (req, res) => {
    try {
        const [users, products, orders] = await Promise.all([
            userModel.countDocuments(),
            productModel.countDocuments(),
            orderModel.countDocuments(),
        ]);

        res.status(200).json({
            success: true,
            data: { users, products, orders },
        });
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export { loginUser, registerUser, adminLogin, getUserProfile, getDashboardStats };
