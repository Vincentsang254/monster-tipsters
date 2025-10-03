/** @format */
const express = require("express");
const { signup, verifyAccount, login, forgotPassword, changePassword, refreshToken } = require("../controllers/authController");
const { verifyToken } = require("../middlewares/AuthMiddleware");


const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/verify-account", verifyAccount);
router.post("/forgot-password", forgotPassword);
router.post("/change-password/:token", changePassword);
router.get("/refresh-token", verifyToken, refreshToken);

module.exports =  router
