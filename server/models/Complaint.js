const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
{
    action: {
        type: String,
        required: true
    },

    performedBy: {
        type: String,
        required: true
    },

    date: {
        type: Date,
        default: Date.now
    }
},
{
    _id: false
});

const complaintSchema = new mongoose.Schema(
{
    complaintId: {
        type: String,
        unique: true,
        required: true
    },

    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    employeeId: {
        type: String,
        required: true
    },

    employeeName: {
        type: String,
        required: true
    },

    department: {
        type: String,
        required: true
    },

    asset: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Asset",
        required: true
    },

    assetId: {
        type: String,
        required: true
    },

    assetName: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true,
        minlength: 20
    },

    priority: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Medium"
    },

    status: {
        type: String,
        enum: [
            "Open",
            "Assigned",
            "In Progress",
            "Resolved",
            "Closed"
        ],
        default: "Open"
    },

    technician: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },

    technicianId: {
        type: String,
        default: ""
    },

    technicianName: {
        type: String,
        default: ""
    },

    attachment: {
        type: String,
        default: ""
    },

    adminRemarks: {
        type: String,
        default: ""
    },

    resolutionNotes: {
        type: String,
        default: ""
    },

    history: [historySchema],

    dateClosed: {
        type: Date,
        default: null
    }

},
{
    timestamps: true
});

module.exports = mongoose.model("Complaint", complaintSchema);