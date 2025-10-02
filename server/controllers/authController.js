/** @format */
const bcryptjs = require("bcryptjs");
const CryptoJS = require("crypto-js");
const generateOtp = require("../utils/otpGenerator");
const {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendWelcomeEmail,
  sendVerificationEmail,
} = require("../brevo/email.brevo");
const generateAuthToken = require("../utils/generateAuthToken");
const { Users } = require("../models");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken"); // missing in your file


const signup = async (req, res) => {
  try {
    let { email, name, password, phoneNumber } = req.body;

    email = email.toLowerCase();

    const errors = [];
    if (!email) errors.push("Please fill in email!");
    if (!name) errors.push("Please fill in name!");
    if (!phoneNumber) errors.push("Please fill in phone number!");
    if (!password) errors.push("Please fill in password!");

    if (errors.length) {
      return res.status(400).json({ success: false, message: errors });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Please use a valid email!" });
    }

    const existingUser = await Users.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "This email is already in use." });
    }

    const hashPassword = await bcryptjs.hash(password, 10);
    const verificationCode = generateOtp();
    const verificationCodeExpiresAt = Date.now() + 3600000; // Token expires in 1 hour
    const user = await Users.create({
      email,
      name,
      phoneNumber,
      verificationCodeExpiresAt,
      verificationCode,
      password: hashPassword,
      verified: false,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      data: { userId: user.id, email: user.email }, // Optionally return user data except sensitive fields
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ where: { email } });

    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ message: "Invalid email or password" });

    // 🔑 Generate tokens
    const { accessToken, refreshToken } = generateAuthToken(user);

    // Store tokens in cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 min
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      success: true,
      message: "Login successful",
      data: {
        id: user.id,
        email: user.email,
        userType: user.userType,
        phoneNumber: user.phoneNumber,
        name: user.name,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find the user by email
    const user = await Users.findOne({ where: { email } });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Generate a reset token using crypto
    const resetToken = CryptoJS.lib.WordArray.random(20).toString(
      CryptoJS.enc.Hex
    );
    const resetTokenExpires = Date.now() + 3600000; // Token expires in 1 hour

    // Save the reset token and expiration time to the user's record
    user.resetToken = resetToken;
    user.resetTokenExpires = resetTokenExpires;
    await user.save();

    // Send an email to the user with the reset link
    const resetLink = `https://monster-tipster.onrender.com/auth/reset-password/${resetToken}`;

    sendPasswordResetEmail(email, resetLink);

    res
      .status(200)
      .json({
        success: true,
        message: "Password reset link sent successfully",
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const verifyAccount = async (req, res) => {
  try {
    const { verificationCode } = req.body;

    const user = await Users.findOne({ where: { verificationCode } });
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "Invalid or expired verification code",
      });
    }

    if (user.verificationCodeExpiresAt < Date.now()) {
      return res
        .status(400)
        .json({ status: false, message: "Verification code has expired" });
    }

    user.verified = true;
    user.verificationCode = null;
    user.verificationCodeExpiresAt = null;
    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    res
      .status(200)
      .json({ status: true, message: "Account successfully verified" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const token = req.params.token;
    const password = req.body.password;

    // Check if newPassword is provided
    if (!password || !token) {
      return res.status(400).json({
        success: false,
        message: "Reset token and new password are required",
      });
    }

    const user = await Users.findOne({
      where: {
        resetToken: token,
        resetTokenExpires: { [Op.gt]: new Date() },
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset code",
      });
    }

    // Update password and clear reset token
    const hashedPassword = await bcryptjs.hash(password, 12);
    await user.update({
      password: hashedPassword,
      resetToken: null,
      resetTokenExpires: null,
    });

    await sendResetSuccessEmail(user.email);

    res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: "Refresh token missing" });

    jwt.verify(refreshToken, REFRESH_SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: "Invalid refresh token" });

      const newAccessToken = jwt.sign(
        { id: user.id, email: user.email, userType: user.userType, name: user.name, phoneNumber: user.phoneNumber },
        ACCESS_SECRET,
        { expiresIn: "15m" }
      );

      // set cookie (optional)
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      });

      // ✅ send back full data
      res.json({
        success: true,
        message: "Access token refreshed",
        user: {
          id: user.id,
          email: user.email,
          userType: user.userType,
          name: user.name,
          phoneNumber: user.phoneNumber,
        },
        accessToken: newAccessToken,
      });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const logout = async (req, res) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  login,
  signup,
  verifyAccount,
  changePassword,
  forgotPassword,
  logout,
  refreshToken,
};
