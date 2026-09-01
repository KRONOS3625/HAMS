const express = require("express");

const router = express.Router();

const {

    getDashboard,

    recentComplaints,

    complaintsByCategory,

    complaintsByDepartment

} = require("../controllers/dashboardController");

const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.get("/", getDashboard);

router.get("/recent", recentComplaints);

router.get("/category", complaintsByCategory);

router.get("/department", complaintsByDepartment);

module.exports = router;