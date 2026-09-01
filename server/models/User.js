const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
    userId: {
        type: String,
        unique: true,
        required: true
    },

    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    password: {
        type: String,
        required: true
    },

    mobile: {
        type: String,
        required: true
    },

    department: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ["employee", "admin", "technician"],
        default: "employee"
    }

},
{
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);