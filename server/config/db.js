const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined.");
        }

        const connection = await mongoose.connect(process.env.MONGODB_URI);

        console.log("=================================");
        console.log(" MongoDB Connected Successfully");
        console.log(` Host : ${connection.connection.host}`);
        console.log(` Database : ${connection.connection.name}`);
        console.log("=================================");
    } catch (error) {
        console.error("MongoDB Connection Failed");
        console.error(error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
