const express = require("express");

const router = express.Router();

const {

    createAsset,

    getAssets,

    getAsset,

    updateAsset,

    deleteAsset,

    searchAssets,

    warrantyReport,

    assetStats

} = require("../controllers/assetController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const validateObjectId = require("../middleware/validateObjectId");

router.use(authMiddleware);
router.param("id", validateObjectId);

/*
==========================
Shared
==========================
*/

router.get("/", getAssets);

router.get("/search", searchAssets);

router.get("/stats", assetStats);

router.get("/warranty", warrantyReport);

router.get("/:id", getAsset);

/*
==========================
Admin Only
==========================
*/

router.post(
    "/",
    roleMiddleware("admin"),
    createAsset
);

router.put(
    "/:id",
    roleMiddleware("admin"),
    updateAsset
);

router.delete(
    "/:id",
    roleMiddleware("admin"),
    deleteAsset
);

module.exports = router;    
