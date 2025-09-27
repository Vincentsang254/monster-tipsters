const jwt = require("jsonwebtoken");
const { Users } = require("../models");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers["x-auth-token"] || req.headers.authorization;

  if (!authHeader) {
    return res.status(403).json({
      success: false,
      message: "Access denied. You must be authenticated. ",
    });
  }

  // Extract token from Bearer scheme if present
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7, authHeader.length)
    : authHeader;

  try {
    const decoded = jwt.verify(token, "sangkiplaimportantkey");

    // Verify the user still exists in database
    const user = await Users.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid token - user not found",
      });
    }

    req.user = {
      id: user.id,
      userType: user.userType,
      email: user.email,
      name: user.name,
      phoneNumber: user.phoneNumber,
    };
    next();
  } catch (error) {
    let message = "Invalid token";

    if (error instanceof jwt.TokenExpiredError) {
      message = "Token expired";
    } else if (error instanceof jwt.JsonWebTokenError) {
      message = "Malformed token";
    }

    res
      .status(500)
      .json({ success: false, message: `${message}. Please log in again.` });
  }
};

const verifyTokenAndAuthorization = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      await verifyToken(req, res, () => {}); // First verify token

      if (!req.user) {
        return res.status(403).json({
          success: false,
          message: "Access denied. No user provided.",
        });
      }

      // If no specific roles required, just continue
      if (allowedRoles.length === 0) {
        return next();
      }

      // Check if user has required role
      if (!allowedRoles.includes(req.user.userType)) {
        return res.status(403).json({
          success: false,
          message: "Access denied. Insufficient privileges.",
          requiredRoles: allowedRoles,
          yourRole: req.user.userType,
        });
      }

      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
};

// Higher-order function for role-based access control
const roleCheck = (requiredRole) => {
  return verifyTokenAndAuthorization([requiredRole]);
};

// Specific role checkers
const isAdmin = roleCheck("admin");
const isUser = roleCheck("client");
const isVip = roleCheck("vip");

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  isAdmin,
  isUser,
  isVip,
};
