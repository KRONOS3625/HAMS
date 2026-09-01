const Complaint = require("../models/Complaint");
const Asset = require("../models/Asset");
const User = require("../models/User");

/*
==========================================================
Dashboard Overview
==========================================================
*/

const getDashboard = async (req, res) => {

    try {

        let complaintFilter = {};

        if (req.user.role === "employee") {
            complaintFilter.employee = req.user._id;
        }

        if (req.user.role === "technician") {
            complaintFilter.technician = req.user._id;
        }

        const complaints = await Complaint.find(complaintFilter);

        const dashboard = {

            totalComplaints: complaints.length,

            openComplaints: complaints.filter(
                c => c.status === "Open"
            ).length,

            assignedComplaints: complaints.filter(
                c => c.status === "Assigned"
            ).length,

            inProgressComplaints: complaints.filter(
                c => c.status === "In Progress"
            ).length,

            resolvedComplaints: complaints.filter(
                c => c.status === "Resolved"
            ).length,

            closedComplaints: complaints.filter(
                c => c.status === "Closed"
            ).length

        };

        if (req.user.role === "admin") {

            dashboard.totalUsers = await User.countDocuments();

            dashboard.totalEmployees = await User.countDocuments({
                role: "employee"
            });

            dashboard.totalTechnicians = await User.countDocuments({
                role: "technician"
            });

            dashboard.totalAssets = await Asset.countDocuments();

        }

        res.json({

            success: true,

            dashboard

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
Recent Complaints
==========================================================
*/

const recentComplaints = async (req, res) => {

    try {

        let filter = {};

        if (req.user.role === "employee") {
            filter.employee = req.user._id;
        }

        if (req.user.role === "technician") {
            filter.technician = req.user._id;
        }

        const complaints = await Complaint.find(filter)

            .sort({
                createdAt: -1
            })

            .limit(10);

        res.json({

            success: true,

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
Complaints by Category
==========================================================
*/

const complaintsByCategory = async (req, res) => {

    try {

        let filter = {};

        if (req.user.role === "employee") {
            filter.employee = req.user._id;
        }

        if (req.user.role === "technician") {
            filter.technician = req.user._id;
        }

        const result = await Complaint.aggregate([
            {
                $match: filter
            },
            {
                $group: {
                    _id: "$category",
                    count: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    count: -1
                }
            }
        ]);

        res.json({

            success: true,

            data: result

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
Complaints by Department
==========================================================
*/

const complaintsByDepartment = async (req, res) => {

    try {

        let filter = {};

        if (req.user.role === "employee") {
            filter.employee = req.user._id;
        }

        if (req.user.role === "technician") {
            filter.technician = req.user._id;
        }

        const result = await Complaint.aggregate([
            {
                $match: filter
            },
            {
                $group: {
                    _id: "$department",
                    count: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    count: -1
                }
            }
        ]);

        res.json({

            success: true,

            data: result

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

module.exports = {

    getDashboard,

    recentComplaints,

    complaintsByCategory,

    complaintsByDepartment

};