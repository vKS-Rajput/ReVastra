import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productmodel.js";

const addProduct = async (req, res) => {
    try {
        const { name, price, description, rental_price, category, subCategory, sizes, contactno, pickuplocation, bestSeller } = req.body;

        if (!name || !description || !price || !category || !sizes || !rental_price || !contactno || !pickuplocation) {
            return res.status(400).json({ success: false, message: "All required fields must be provided." });
        }

        let parsedSizes;
        try {
            parsedSizes = Array.isArray(sizes) ? sizes : JSON.parse(sizes);
        } catch (error) {
            return res.status(400).json({ success: false, message: "Invalid sizes format. Must be valid JSON." });
        }

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
                    console.error("Error uploading image:", error);
                    throw new Error("Image upload failed.");
                }
            })
        );

        const productData = {
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
        };

        const product = new productModel(productData);
        await product.save();

        res.status(200).json({ success: true, message: "Product added successfully", product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const listProduct = async (req, res) => {
    try {
        const products = await productModel.find({});
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

export { addProduct, listProduct, removeProduct, singleProduct };
