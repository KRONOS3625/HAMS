const express = require("express");

const router = express.Router();

const {

    getUsers,

    getUser,

    createUser,

    updateUser,

    deleteUser

} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const validateObjectId = require("../middleware/validateObjectId");

router.use(authMiddleware);
router.param("id", validateObjectId);

router.use(roleMiddleware("admin"));

router.get("/", getUsers);

router.get("/:id", getUser);

router.post("/", createUser);

router.put("/:id", updateUser);

router.delete("/:id", deleteUser);

module.exports = router;
