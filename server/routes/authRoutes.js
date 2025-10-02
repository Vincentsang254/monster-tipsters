/** @format */
const express = require("express");
const { signup, verifyAccount, login, forgotPassword, changePassword, logout, refreshToken } = require("../controllers/authController");


const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/verify-account", verifyAccount);
router.post("/forgot-password", forgotPassword);
router.post("/change-password/:token", changePassword);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);

module.exports =  router
