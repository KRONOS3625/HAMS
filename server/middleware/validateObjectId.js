const mongoose = require("mongoose");

const validateObjectId = (req, res, next, value) => {
    if (!mongoose.isValidObjectId(value)) {
        return res.status(400).json({
            success: false,
            message: "Invalid ID."
        });
    }

    next();
};

module.exports = validateObjectId;
