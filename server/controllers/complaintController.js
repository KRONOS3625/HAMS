const Complaint = require("../models/Complaint");
const Asset = require("../models/Asset");
const User = require("../models/User");

const generateComplaintId = require("../utils/generateComplaintId");
const createNotification = require("../utils/createNotification");

const idString = (value) => {
    if (!value) return "";
    return String(value._id || value);
};

const buildRoleFilter = (user) => {
    if (user.role === "employee") {
        return { employee: user._id };
    }

    if (user.role === "technician") {
        return { technician: user._id };
    }

    return {};
};

/*
==========================================================
Create Complaint
POST /api/complaints
==========================================================
*/

const createComplaint = async (req, res) => {

    try {

        const {
            assetId,
            category,
            description,
            priority
        } = req.body;

        if (!assetId || !category || !description) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields."
            });
        }

        if (description.trim().length < 20) {
            return res.status(400).json({
                success: false,
                message:
                    "Description must contain at least 20 characters."
            });
        }

        const asset = await Asset.findOne({
            assetId
        });

        if (!asset) {
            return res.status(404).json({
                success: false,
                message: "Invalid Asset ID."
            });
        }

        const complaint = await Complaint.create({

            complaintId: await generateComplaintId(),

            employee: req.user._id,

            employeeId: req.user.userId,

            employeeName: req.user.name,

            department: req.user.department,

            asset: asset._id,

            assetId: asset.assetId,

            assetName: asset.assetName,

            category,

            description,

            priority: priority || "Medium",

            attachment: req.file
                ? req.file.filename
                : "",

            history: [
                {
                    action: "Complaint Created",
                    performedBy: req.user.name
                }
            ]

        });

        const admins = await User.find({
            role: "admin"
        });

        for (const admin of admins) {

            await createNotification(

                admin._id,

                "New Complaint",

                `${req.user.name} created complaint ${complaint.complaintId}`

            );

        }

        res.status(201).json({

            success: true,

            message: "Complaint created successfully.",

            complaint

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/*
==========================================================
Get All Complaints
==========================================================
*/

const getComplaints = async (req, res) => {

    try {

        let query = buildRoleFilter(req.user);

        if (req.query.status) {

            query.status = req.query.status;

        }

        if (req.query.priority) {

            query.priority = req.query.priority;

        }

        const complaints = await Complaint.find(query)

            .populate("employee", "name email department")

            .populate("technician", "name email")

            .populate("asset", "assetName assetId")

            .sort({
                createdAt: -1
            });

        res.json({

            success: true,

            count: complaints.length,

            complaints

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/*
==========================================================
Get Single Complaint
==========================================================
*/

const getComplaintById = async (req, res) => {

    try {

        const complaint = await Complaint.findById(

            req.params.id

        )

            .populate("employee")

            .populate("technician")

            .populate("asset");

        if (!complaint) {

            return res.status(404).json({

                success: false,

                message: "Complaint not found."

            });

        }

        if (
            req.user.role === "employee" &&
            idString(complaint.employee) !==
                req.user._id.toString()
        ) {

            return res.status(403).json({

                success: false,

                message: "Unauthorized."

            });

        }

        if (
            req.user.role === "technician" &&
            (!complaint.technician ||
            idString(complaint.technician) !==
                req.user._id.toString()
            )
        ) {

            return res.status(403).json({

                success: false,

                message: "Unauthorized."

            });

        }

        res.json({

            success: true,

            complaint

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
/*
==========================================================
Update Complaint
(Employee can edit only before assignment)
==========================================================
*/

const updateComplaint = async (req, res) => {

    try {

        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found."
            });
        }

        if (idString(complaint.employee) !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized."
            });
        }

        if (
            complaint.status !== "Open" ||
            complaint.technician
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Complaint cannot be edited after assignment."
            });
        }

        const {
            category,
            assetId,
            description,
            priority
        } = req.body;

        if (assetId) {

            const asset = await Asset.findOne({
                assetId
            });

            if (!asset) {
                return res.status(404).json({
                    success: false,
                    message: "Asset not found."
                });
            }

            complaint.asset = asset._id;
            complaint.assetId = asset.assetId;
            complaint.assetName = asset.assetName;

        }

        if (category) complaint.category = category;

        if (description) {

            if (description.trim().length < 20) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Description must contain at least 20 characters."
                });

            }

            complaint.description = description;

        }

        if (priority)
            complaint.priority = priority;

        if (req.file) {
            complaint.attachment = req.file.filename;
        }

        complaint.history.push({

            action: "Complaint Updated",

            performedBy: req.user.name

        });

        await complaint.save();

        res.json({

            success: true,

            message: "Complaint updated successfully.",

            complaint

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/*
==========================================================
Assign Technician
(Admin)
==========================================================
*/

const assignTechnician = async (req, res) => {

    try {

        const { technicianId, remarks } = req.body;

        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {

            return res.status(404).json({

                success: false,

                message: "Complaint not found."

            });

        }

        const technician = await User.findOne({

            userId: technicianId,

            role: "technician"

        });

        if (!technician) {

            return res.status(404).json({

                success: false,

                message: "Technician not found."

            });

        }

        complaint.technician = technician._id;

        complaint.technicianId = technician.userId;

        complaint.technicianName = technician.name;

        complaint.status = "Assigned";

        complaint.adminRemarks = remarks || "";

        complaint.history.push({

            action:
                `Assigned to ${technician.name}`,

            performedBy: req.user.name

        });

        await complaint.save();

        await createNotification(

            technician._id,

            "New Assignment",

            `Complaint ${complaint.complaintId} has been assigned to you.`

        );

        await createNotification(

            complaint.employee,

            "Complaint Assigned",

            `Your complaint ${complaint.complaintId} has been assigned to ${technician.name}.`

        );

        res.json({

            success: true,

            message: "Technician assigned successfully.",

            complaint

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/*
==========================================================
Update Complaint Status
(Technician)
==========================================================
*/

const updateComplaintStatus = async (req, res) => {

    try {

        const {

            status,

            resolutionNotes

        } = req.body;

        const validStatuses = ["Assigned", "In Progress", "Resolved"];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status."
            });
        }

        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {

            return res.status(404).json({

                success: false,

                message: "Complaint not found."

            });

        }

        if (!complaint.technician) {
            return res.status(400).json({
                success: false,
                message: "Complaint has not been assigned to a technician."
            });
        }

        if (idString(complaint.technician) !== req.user._id.toString()) {

            return res.status(403).json({

                success: false,

                message:
                    "Only assigned technician can update this complaint."

            });

        }

        complaint.status = status;

        if (resolutionNotes) {

            complaint.resolutionNotes =
                resolutionNotes;

        }

        complaint.history.push({

            action:
                `Status changed to ${status}`,

            performedBy: req.user.name

        });

        await complaint.save();

        await createNotification(

            complaint.employee,

            "Complaint Updated",

            `Complaint ${complaint.complaintId} status is now ${status}.`

        );

        res.json({

            success: true,

            message: "Status updated successfully.",

            complaint

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/*
==========================================================
Close Complaint
(Admin)
==========================================================
*/

const closeComplaint = async (req, res) => {

    try {

        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found."
            });
        }

        if (complaint.status !== "Resolved") {
            return res.status(400).json({
                success: false,
                message:
                    "Only resolved complaints can be closed."
            });
        }

        complaint.status = "Closed";
        complaint.dateClosed = new Date();

        complaint.history.push({
            action: "Complaint Closed",
            performedBy: req.user.name
        });

        await complaint.save();

        await createNotification(
            complaint.employee,
            "Complaint Closed",
            `Complaint ${complaint.complaintId} has been closed.`
        );

        res.json({
            success: true,
            message: "Complaint closed successfully.",
            complaint
        });

    }

    catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

/*
==========================================================
Delete Complaint
(Admin)
==========================================================
*/

const deleteComplaint = async (req, res) => {

    try {

        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {

            return res.status(404).json({
                success: false,
                message: "Complaint not found."
            });

        }

        await complaint.deleteOne();

        res.json({
            success: true,
            message: "Complaint deleted successfully."
        });

    }

    catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

/*
==========================================================
Search Complaints
==========================================================
*/

const searchComplaints = async (req, res) => {

    try {

        const keyword = req.query.keyword || "";

        const complaints = await Complaint.find({

            ...buildRoleFilter(req.user),

            $or: [

                {
                    complaintId: {
                        $regex: keyword,
                        $options: "i"
                    }
                },

                {
                    employeeName: {
                        $regex: keyword,
                        $options: "i"
                    }
                },

                {
                    assetName: {
                        $regex: keyword,
                        $options: "i"
                    }
                },

                {
                    department: {
                        $regex: keyword,
                        $options: "i"
                    }
                },

                {
                    category: {
                        $regex: keyword,
                        $options: "i"
                    }
                },

                {
                    status: {
                        $regex: keyword,
                        $options: "i"
                    }
                }

            ]

        })
            .populate("employee", "name")
            .populate("technician", "name")
            .populate("asset", "assetName");

        res.json({

            success: true,

            count: complaints.length,

            complaints

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/*
==========================================================
Employee Complaint History
==========================================================
*/

const getEmployeeHistory = async (req, res) => {

    try {

        const complaints = await Complaint.find({

            employee: req.user._id

        })

        .sort({

            createdAt: -1

        });

        res.json({

            success: true,

            count: complaints.length,

            complaints

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/*
==========================================================
Dashboard Statistics
==========================================================
*/

const dashboardStats = async (req, res) => {

    try {

        let query = {};

        if (req.user.role === "employee") {
            query.employee = req.user._id;
        }

        if (req.user.role === "technician") {
            query.technician = req.user._id;
        }

        const complaints = await Complaint.find(query);

        const stats = {

            total: complaints.length,

            open: complaints.filter(
                c => c.status === "Open"
            ).length,

            assigned: complaints.filter(
                c => c.status === "Assigned"
            ).length,

            inProgress: complaints.filter(
                c => c.status === "In Progress"
            ).length,

            resolved: complaints.filter(
                c => c.status === "Resolved"
            ).length,

            closed: complaints.filter(
                c => c.status === "Closed"
            ).length

        };

        res.json({

            success: true,

            stats

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/*
==========================================================
Module Exports
==========================================================
*/

module.exports = {

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

};
