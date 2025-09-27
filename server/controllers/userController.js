const generateOtp = require("../utils/otpGenerator");
const { Users, Payments } = require("../models");
const bcryptjs = require("bcryptjs");
const { Op} = require("sequelize")


const createUsers = async (req, res) => {
  const { email, name, password, phoneNumber } = req.body;

  try {
    const user = await Users.findOne({ where: { email: email } });

    if (user) {
      res
        .status(400)
        .json({ success: false, message: "User Already registered" });
    }

    const hashpass = await bcryptjs.hash(password, 10);
    const verificationCode = generateOtp();
    await Users.create({
      email,
      name,
      verificationCode,
      password: hashpass,
      phoneNumber,
    });

    res
      .status(201)
      .json({ success: true, message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const deletedUser =  await Users.destroy({
      where: {
        id: userId,
      },
    });

    res
      .status(201)
      .json({ success: true, data: deletedUser, message: "User deleted succcessfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateUser = async (req, res) => {
  const userId = req.params.userId;
  const { email, name, password, phoneNumber, userType } = req.body;

  try {
    if (!email || !name || !phoneNumber || !userType) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Please provide all required fields.",
        });
    }

    // Check if the user exists
    const user = await Users.findByPk(userId);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Ooops!, No such user." });
    }

    const checkEmail = await Users.findOne({
      where: { email, id: { [Op.ne]: userId } },
    });
    

    if (checkEmail) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Ooops!, This email is already in use.",
        });
    }

  

    const hashedPassword = password
      ? await bcryptjs.hash(password, await bcryptjs.genSalt(10))
      : user.password;

    await Users.update(
      { email, name, password: hashedPassword, phoneNumber, userType },
      { where: { id: userId } }
    );

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: { email, name, phoneNumber, userType }, // Include the updated user data
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      include: [
        {
          model: Payments,
          as: "payments",  // must match Users.hasMany alias
          attributes: [
            "amount",
            "status",
            "reference",
            "phoneNumber",
            "createdAt",
            "checkoutRequestId",
            "mpesaReceiptNumber"
          ],
        },
      ],
    });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUserById = async (req, res) => {
  const userId = req.user.id; // from auth middleware
  try {
    const user = await Users.findOne({
      where: { id: userId },
      include: [
        {
          model: Payments,
          as: "payments",
          attributes: [
            "id",
            "amount",
            "status",
            "reference",
            "phoneNumber",
            "createdAt",
            "checkoutRequestId",
            "mpesaReceiptNumber",
      
          ],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "No such user found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const userId = req.user.id;
    const user = await Users.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        userType: user.userType,
        createdAt: user.createdAt,
        accessExpiration: user.accessExpiration,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  const { name, email, phoneNumber } = req.body;

  if (!name || !email || !phoneNumber) {
    return res.status(400).json({
      success: false,
      message: "All fields are required (name, email, phone number).",
    });
  }

  try {
    const userId = req.user.id;

    const user = await Users.findByPk(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const existingEmail = await Users.findOne({
      where: {
        email,
        id: { [Op.ne]: userId },
      },
    });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "This email is already in use.",
      });
    }

    await user.update({ name, email, phoneNumber });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


module.exports = {
  createUsers,
	deleteUser,
	updateUser,
	getUsers,
	getUserById,
	getUserProfile,
	updateUserProfile,
}