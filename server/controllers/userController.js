const bcrypt = require("bcryptjs");

const User = require("../models/User");
const generateUserId = require("../utils/generateUserId");

const duplicateKeyField = (error) => {
    if (error.code !== 11000) return "";
    return Object.keys(error.keyValue || {})[0] || "field";
};

/*
GET /api/users
*/
const getUsers = async (req, res) => {
    try {

        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: users.length,
            users
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

/*
GET /api/users/:id
*/
const getUser = async (req, res) => {

    try {

        const user = await User.findById(req.params.id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        res.json({
            success: true,
            user
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

/*
POST /api/users
*/
const createUser = async (req, res) => {

    try {

        const {
            name,
            email,
            password,
            mobile,
            department,
            role
        } = req.body;

        if (
            !name ||
            !email ||
            !password ||
            !mobile ||
            !department ||
            !role
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        const exists = await User.findOne({
            email: email.toLowerCase()
        });

        if (exists) {
            return res.status(400).json({
                success: false,
                message: "Email already exists."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let user;

        for (let attempts = 0; attempts < 5; attempts++) {
            try {
                user = await User.create({

                    userId: await generateUserId(role),

                    name,

                    email: email.toLowerCase(),

                    password: hashedPassword,

                    mobile,

                    department,

                    role

                });

                break;
            } catch (error) {
                const duplicateField = duplicateKeyField(error);

                if (duplicateField === "userId") {
                    continue;
                }

                throw error;
            }
        }

        if (!user) {
            return res.status(500).json({
                success: false,
                message: "Unable to generate a unique user ID. Please try again."
            });
        }

        res.status(201).json({

            success: true,

            message: "User created successfully.",

            user: {
                ...user.toObject(),
                password: undefined
            }

        });

    } catch (error) {

        const duplicateField = duplicateKeyField(error);

        if (duplicateField === "email") {
            return res.status(400).json({
                success: false,
                message: "Email already exists."
            });
        }

        if (duplicateField === "userId") {
            return res.status(400).json({
                success: false,
                message: "User ID already exists. Please try again."
            });
        }

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

/*
PUT /api/users/:id
*/
const updateUser = async (req, res) => {

    try {

        const updates = { ...req.body };

        delete updates.userId;

        if (updates.password) {
            updates.password = await bcrypt.hash(
                updates.password,
                10
            );
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            updates,
            {
                new: true,
                runValidators: true
            }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        res.json({
            success: true,
            message: "User updated successfully.",
            user
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

/*
DELETE /api/users/:id
*/
const deleteUser = async (req, res) => {

    try {

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        await user.deleteOne();

        res.json({
            success: true,
            message: "User deleted successfully."
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {

    getUsers,

    getUser,

    createUser,

    updateUser,

    deleteUser

};
