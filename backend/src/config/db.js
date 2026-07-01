import mongoose from "mongoose";

const connectDB = async () => {

    try {

        mongoose.set('sanitizeFilter', true);
        
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Server connected to DB");

    } catch (error) {
        console.error("MongoDB connection failed", error?.message);
        process.exit(1);
    }

};

export default connectDB;