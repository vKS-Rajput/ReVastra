import mongoose from "mongoose";

const connectDB = async () => {
    try {
        // Event listeners for MongoDB connection status
        mongoose.connection.on('connected', () => {
            console.log("DB Connected");
        });
        mongoose.connection.on('error', (err) => {
            console.error("MongoDB connection error:", err);
        });
        mongoose.connection.on('disconnected', () => {
            console.log("MongoDB connection disconnected");
        });

        // Connect to MongoDB
        await mongoose.connect(`${process.env.MONGODB_URI}/revastra`);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};

export default connectDB;
