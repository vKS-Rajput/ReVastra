import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productmodel.js";
import userModel from "../models/userModel.js";


const addProduct = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ Extract userId from middleware

    const {
      name,
      price,
      description,
      rental_price,
      category,
      subCategory,
      sizes,
      contactno,
      pickuplocation,
      bestSeller,
    } = req.body;

    // ✅ Check required fields
    if (!name || !description || !price || !category || !sizes || !rental_price || !contactno || !pickuplocation) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided.",
      });
    }

    // ✅ Parse sizes
    let parsedSizes;
    try {
      parsedSizes = Array.isArray(sizes) ? sizes : JSON.parse(sizes);
    } catch (error) {
      return res.status(400).json({ success: false, message: "Invalid sizes format. Must be valid JSON." });
    }

    // ✅ Handle image uploads
    const images = req.files
      ? [req.files.image1, req.files.image2, req.files.image3, req.files.image4].filter(Boolean)
      : req.file ? [req.file] : [];

    if (images.length === 0) {
      return res.status(400).json({ success: false, message: "At least one image must be uploaded." });
    }

    const imagesUrl = await Promise.all(
      images.map(async (item) => {
        try {
          const result = await cloudinary.uploader.upload(item[0].path, { resource_type: "image" });
          return result.secure_url;
        } catch (error) {
          console.error("❌ Error uploading image:", error);
          throw new Error("Image upload failed.");
        }
      })
    );

    // ✅ Product data with userId from auth middleware
    const productData = {
      userId,
      name,
      description,
      price: Number(price),
      category,
      subCategory,
      rental_price: Number(rental_price),
      sizes: parsedSizes,
      bestSeller: Boolean(bestSeller),
      pickuplocation,
      contactno,
      image: imagesUrl,
      date: Date.now(),
      status: "available",
    };

    // ✅ Save product
    const product = new productModel(productData);
    await product.save();

    res.status(200).json({ success: true, message: "Product added successfully", product });
  } catch (error) {
    console.error("❌ Error adding product:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const listProduct = async (req, res) => {
  try {
    // Fetches all banned users
    const bannedUsers = await userModel.find({ isBanned: true }).select('_id');
    const bannedUserIds = bannedUsers.map(u => u._id.toString());

    // Filter out products where userId is in the banned list
    // check if userId is string or ObjectId in productModel. It is String based on schema view.
    const products = await productModel.find({ userId: { $nin: bannedUserIds } });

    res.json({ success: true, products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const removeProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.body.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Product Removed Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const singleProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }
    res.json({ success: true, product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const myProducts = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ Access user ID from authUser middleware
    const products = await productModel.find({ userId });

    // Always return 200 with products array (even if empty)
    res.json({ success: true, products });
  } catch (error) {
    console.error("❌ Error fetching user's products:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



// ✅ New function to update product status
const updateProductStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["available", "out_of_stock"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const product = await productModel.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, message: "Product status updated", product });
  } catch (error) {
    console.error("Error updating product status:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ User function to delete their own product (with ownership verification)
const removeUserProduct = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id;

    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    // Verify ownership
    if (product.userId !== userId) {
      return res.status(403).json({ success: false, message: "You can only delete your own products." });
    }

    await productModel.findByIdAndDelete(productId);
    res.json({ success: true, message: "Product removed successfully" });
  } catch (error) {
    console.error("Error removing user product:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { addProduct, listProduct, removeProduct, singleProduct, updateProductStatus, myProducts, removeUserProduct };
