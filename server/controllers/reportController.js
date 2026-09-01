const Complaint = require("../models/Complaint");

/*
==========================================================
Department Report
==========================================================
*/

const departmentReport = async (req, res) => {

    try {

        const report = await Complaint.aggregate([
            {
                $group: {
                    _id: "$department",
                    totalComplaints: { $sum: 1 },
                    open: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "Open"] }, 1, 0]
                        }
                    },
                    closed: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "Closed"] }, 1, 0]
                        }
                    }
                }
            },
            {
                $sort: {
                    totalComplaints: -1
                }
            }
        ]);

        res.json({
            success: true,
            report
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

/*
==========================================================
Category Report
==========================================================
*/

const categoryReport = async (req, res) => {

    try {

        const report = await Complaint.aggregate([
            {
                $group: {
                    _id: "$category",
                    complaints: { $sum: 1 }
                }
            },
            {
                $sort: {
                    complaints: -1
                }
            }
        ]);

        res.json({
            success: true,
            report
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

/*
==========================================================
Monthly Report
==========================================================
*/

const monthlyReport = async (req, res) => {

    try {

        const report = await Complaint.aggregate([

            {
                $group: {
                    _id: {
                        year: {
                            $year: "$createdAt"
                        },
                        month: {
                            $month: "$createdAt"
                        }
                    },
                    complaints: {
                        $sum: 1
                    }
                }
            },

            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1
                }
            }

        ]);

        res.json({
            success: true,
            report
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

/*
==========================================================
Closed Complaints
==========================================================
*/

const closedReport = async (req, res) => {

    try {

        const complaints = await Complaint.find({

            status: "Closed"

        }).sort({

            createdAt: -1

        });

        res.json({

            success: true,

            count: complaints.length,

            complaints

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/*
==========================================================
Pending Complaints
==========================================================
*/

const pendingReport = async (req, res) => {

    try {

        const complaints = await Complaint.find({

            status: {
                $ne: "Closed"
            }

        }).sort({

            createdAt: -1

        });

        res.json({

            success: true,

            count: complaints.length,

            complaints

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

module.exports = {

    departmentReport,

    categoryReport,

    monthlyReport,

    closedReport,

    pendingReport

};