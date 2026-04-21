const mongoose = require("mongoose");
require("dotenv").config();

const testConnect = async () => {
    try {
        console.log("Connecting to:", process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log("SUCCESS: MongoDB Connected");
        process.exit(0);
    } catch (err) {
        console.error("FAILURE: MongoDB connection error:", err.message);
        process.exit(1);
    }
};

testConnect();
