const jwt = require("jsonwebtoken");

const generateAuthToken = (user) => {
  const accessToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
      userType: user.userType,
      name: user.name,
      phoneNumber: user.phoneNumber,
    },
    process.env.ACCESS_SECRET || "sangkiplaimportantkeyaccesssecretkey",
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.REFRESH_SECRET || "sangkiplaimportantkeyrefreshsecretkey",
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

module.exports = generateAuthToken;
