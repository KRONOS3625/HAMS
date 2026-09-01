const express = require("express");

const router = express.Router();

const {
    login,
    getCurrentUser
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

// Login

router.post("/login", login);

// Logged in user

router.get("/me", authMiddleware, getCurrentUser);

module.exports = router;