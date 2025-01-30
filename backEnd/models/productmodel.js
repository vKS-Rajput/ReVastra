import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: [String], required: true },
    category: { type: String, required: true },
    subCategory: { type: String },
    sizes: { type: [String], required: true },
    rental_price: {type: Number, required: true},
    bestSeller: { type: Boolean },
    pickuplocation: { type: String, required: true }, // ✅ Added field
    contactno: { type: String, required: true },
    date: { type: Date, default: Date.now } // Default date
});

const productModel = mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
