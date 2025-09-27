// const necessary modules
const express = require("express");
const {
	createUsers,
	deleteUser,
	updateUser,
	getUsers,
	getUserById,
	getUserProfile,
	updateUserProfile,
} = require("../controllers/userController");
const { verifyToken ,isAdmin } = require("../middlewares/AuthMiddleware");

const router = express.Router();

router.post("/create", isAdmin,  createUsers);
router.delete("/delete/:userId", isAdmin, deleteUser);
router.put("/update/:userId", verifyToken,  updateUser);
router.get("/get", verifyToken, getUsers);
router.get("/get/:userId",verifyToken, getUserById);
router.get("/getprofile",verifyToken, getUserProfile);
router.put("/updateprofile",verifyToken, updateUserProfile);

module.exports = router
