import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: [String], required: true },
    category: { type: String, required: true },
    subCategory: { type: String },
    sizes: { type: [String], required: true },
    rental_price: { type: Number, required: true },
    bestSeller: { type: Boolean },
    pickuplocation: { type: String, required: true },
    contactno: { type: String, required: true },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ["available", "out_of_stock"], default: "available" } // ✅ Added status field
});

const productModel = mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
