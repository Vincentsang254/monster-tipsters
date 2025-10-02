const jwt = require("jsonwebtoken");

const ACCESS_SECRET = process.env.ACCESS_SECRET || "sangkiplaimportantkeyaccesssecretkey";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "sangkiplaimportantkeyrefreshsecretkey";

const generateAuthToken = (user, res) => {
  if (!user || !user.id || !user.email || !user.userType) {
    throw new Error("User information missing or invalid");
  }

  const payload = {
    id: user.id,
    userType: user.userType,
    email: user.email,
    name: user.name,
  };

  // Access token (short)
  const accessToken = jwt.sign(payload, ACCESS_SECRET, { expiresIn: "15m" });
  // Refresh token (long)
  const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" });

  // Set cookies
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // only https in prod
    sameSite: "strict",
    maxAge: 15 * 60 * 1000, // 15 min
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return { accessToken, refreshToken }; // return in case you want it internally
};

module.exports = generateAuthToken;
