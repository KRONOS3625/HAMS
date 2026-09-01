const Asset = require("../models/Asset");
const Complaint = require("../models/Complaint");
const generateAssetId = require("../utils/generateAssetId");

/*
==========================================================
Create Asset
==========================================================
*/

const createAsset = async (req, res) => {

    try {

        const {
            assetName,
            category,
            brand,
            purchaseDate,
            warrantyExpiry,
            assignedEmployee
        } = req.body;

        if (
            !assetName ||
            !category ||
            !brand ||
            !purchaseDate ||
            !warrantyExpiry
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields."
            });
        }

        const asset = await Asset.create({

            assetId: await generateAssetId(),

            assetName,

            category,

            brand,

            purchaseDate,

            warrantyExpiry,

            assignedEmployee

        });

        res.status(201).json({

            success: true,

            message: "Asset created successfully.",

            asset

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
Get All Assets
==========================================================
*/

const getAssets = async (req, res) => {

    try {

        let query = {};

        if (req.query.category) {

            query.category = req.query.category;

        }

        if (req.query.brand) {

            query.brand = req.query.brand;

        }

        const assets = await Asset.find(query)

            .sort({
                createdAt: -1
            });

        res.json({

            success: true,

            count: assets.length,

            assets

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
Get Single Asset
==========================================================
*/

const getAsset = async (req, res) => {

    try {

        const asset = await Asset.findById(req.params.id);

        if (!asset) {

            return res.status(404).json({

                success: false,

                message: "Asset not found."

            });

        }

        res.json({

            success: true,

            asset

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
Update Asset
==========================================================
*/

const updateAsset = async (req, res) => {

    try {

        const asset = await Asset.findByIdAndUpdate(

            req.params.id,

            req.body,

            {
                new: true,
                runValidators: true
            }

        );

        if (!asset) {

            return res.status(404).json({

                success: false,

                message: "Asset not found."

            });

        }

        res.json({

            success: true,

            message: "Asset updated successfully.",

            asset

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
Delete Asset
==========================================================
*/

const deleteAsset = async (req, res) => {

    try {

        const asset = await Asset.findById(req.params.id);

        if (!asset) {

            return res.status(404).json({
                success: false,
                message: "Asset not found."
            });

        }

        const linkedComplaint = await Complaint.findOne({
            assetId: asset.assetId
        });

        if (linkedComplaint) {

            return res.status(400).json({
                success: false,
                message:
                    "This asset is linked to one or more complaints and cannot be deleted."
            });

        }

        await asset.deleteOne();

        res.json({

            success: true,

            message: "Asset deleted successfully."

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
Search Assets
==========================================================
*/

const searchAssets = async (req, res) => {

    try {

        const keyword = req.query.keyword || "";

        const assets = await Asset.find({

            $or: [

                {
                    assetId: {
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
                    category: {
                        $regex: keyword,
                        $options: "i"
                    }
                },

                {
                    brand: {
                        $regex: keyword,
                        $options: "i"
                    }
                },

                {
                    assignedEmployee: {
                        $regex: keyword,
                        $options: "i"
                    }
                }

            ]

        });

        res.json({

            success: true,

            count: assets.length,

            assets

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
Warranty Report
==========================================================
*/

const warrantyReport = async (req, res) => {

    try {

        const today = new Date();

        const assets = await Asset.find();

        const report = assets.map(asset => {

            const expiry = new Date(asset.warrantyExpiry);

            const remainingDays = Math.ceil(
                (expiry - today) /
                (1000 * 60 * 60 * 24)
            );

            return {

                assetId: asset.assetId,

                assetName: asset.assetName,

                warrantyExpiry: asset.warrantyExpiry,

                remainingDays,

                expired: remainingDays < 0

            };

        });

        res.json({

            success: true,

            report

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
Asset Statistics
==========================================================
*/

const assetStats = async (req, res) => {

    try {

        const assets = await Asset.find();

        const stats = {

            total: assets.length,

            laptops: assets.filter(
                a => a.category === "Laptop"
            ).length,

            desktops: assets.filter(
                a => a.category === "Desktop"
            ).length,

            printers: assets.filter(
                a => a.category === "Printer"
            ).length,

            network: assets.filter(
                a => a.category === "Network"
            ).length,

            others: assets.filter(
                a => a.category === "Other"
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
Exports
==========================================================
*/

module.exports = {

    createAsset,

    getAssets,

    getAsset,

    updateAsset,

    deleteAsset,

    searchAssets,

    warrantyReport,

    assetStats

};