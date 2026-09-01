const express = require("express");

const router = express.Router();

const {
    departmentReport,
    categoryReport,
    monthlyReport,
    closedReport,
    pendingReport
} = require("../controllers/reportController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// All report routes require authentication
router.use(authMiddleware);

/*
==========================================================
Reports API Home
GET /api/reports
(Admin Only)
==========================================================
*/

router.get(
    "/",
    roleMiddleware("admin"),
    (req, res) => {
        res.json({
            success: true,
            message: "Helpdesk Management System Reports API",
            availableReports: {
                department: "/api/reports/department",
                category: "/api/reports/category",
                monthly: "/api/reports/monthly",
                closed: "/api/reports/closed",
                pending: "/api/reports/pending"
            }
        });
    }
);

/*
==========================================================
Department Report
GET /api/reports/department
==========================================================
*/

router.get(
    "/department",
    roleMiddleware("admin"),
    departmentReport
);

/*
==========================================================
Category Report
GET /api/reports/category
==========================================================
*/

router.get(
    "/category",
    roleMiddleware("admin"),
    categoryReport
);

/*
==========================================================
Monthly Report
GET /api/reports/monthly
==========================================================
*/

router.get(
    "/monthly",
    roleMiddleware("admin"),
    monthlyReport
);

/*
==========================================================
Closed Complaints Report
GET /api/reports/closed
==========================================================
*/

router.get(
    "/closed",
    roleMiddleware("admin"),
    closedReport
);

/*
==========================================================
Pending Complaints Report
GET /api/reports/pending
==========================================================
*/

router.get(
    "/pending",
    roleMiddleware("admin"),
    pendingReport
);

module.exports = router;