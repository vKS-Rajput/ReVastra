import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    // items array contains: name, size, duration (rental days), rental_price, image, etc.
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, required: true, default: 'Order Placed' },
    paymentMethod: { type: String, required: true },
    payment: { type: Boolean, required: true, default: false },
    date: { type: Number, required: true, },
    // New fields for enhanced rental system
    rentalStartDate: { type: Date },
    rentalEndDate: { type: Date },
    deliveryDate: { type: Date },
    urgentOrder: { type: Boolean, default: false },
    urgentFee: { type: Number, default: 0 },
    pricingBreakdown: { type: Object } // Stores tiered pricing details
})

const orderModel = mongoose.models.order || mongoose.model('order', orderSchema)
export default orderModel;