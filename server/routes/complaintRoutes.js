const express = require("express");

const router = express.Router();

const {

    createComplaint,

    getComplaints,

    getComplaintById,

    updateComplaint,

    assignTechnician,

    updateComplaintStatus,

    closeComplaint,

    deleteComplaint,

    searchComplaints,

    getEmployeeHistory,

    dashboardStats

} = require("../controllers/complaintController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const uploadMiddleware = require("../middleware/uploadMiddleware");
const validateObjectId = require("../middleware/validateObjectId");

router.use(authMiddleware);
router.param("id", validateObjectId);

/*
==========================================================
Employee
==========================================================
*/

router.post(
    "/",
    roleMiddleware("employee"),
    uploadMiddleware.single("attachment"),
    createComplaint
);

router.put(
    "/:id",
    roleMiddleware("employee"),
    uploadMiddleware.single("attachment"),
    updateComplaint
);

router.get(
    "/my/history",
    roleMiddleware("employee"),
    getEmployeeHistory
);

/*
==========================================================
Shared
==========================================================
*/

router.get("/", getComplaints);

router.get("/dashboard/stats", dashboardStats);

router.get("/search", searchComplaints);

/*
==========================================================
Administrator
==========================================================
*/

router.put(
    "/assign/:id",
    roleMiddleware("admin"),
    assignTechnician
);

router.put(
    "/close/:id",
    roleMiddleware("admin"),
    closeComplaint
);

router.delete(
    "/:id",
    roleMiddleware("admin"),
    deleteComplaint
);

/*
==========================================================
Technician
==========================================================
*/

router.put(
    "/status/:id",
    roleMiddleware("technician"),
    updateComplaintStatus
);

router.get("/:id", getComplaintById);

module.exports = router;
