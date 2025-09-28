/** @format */
const axios = require("axios");
const moment = require("moment");
const { Payments, Users } = require("../models");
const cron = require("node-cron");
const { Op } = require("sequelize");

// Credentials for Payhero API
const apiUsername = process.env.PAYHERO_API_USERNAME || "LykioY8LI38TwLWSEOpX";
const apiPassword =
  process.env.PAYHERO_API_PASSWORD ||
  "blP4TJA0O8yVtyH4G7U7AzpwktnTJOx31THnoPzM";
const encodedCredentials = Buffer.from(
  `${apiUsername}:${apiPassword}`
).toString("base64");

const PAYMENT_TIERS = {
  1: 3,
  2: 7,
  3: 30,
};

// ✅ Cron job: Reset expired VIP users to 'client'
cron.schedule("0 * * * *", async () => {
  try {
    const expiredUsers = await Users.findAll({
      where: {
        accessExpiration: { [Op.lte]: new Date() },
        userType: "vip",
      },
    });

    for (const user of expiredUsers) {
      await Users.update({ userType: "client" }, { where: { id: user.id } });
      console.log(`User ${user.id} reset to 'client' due to expiry.`);
    }
  } catch (error) {
    console.error("Cron error:", error.message);
  }
});

// ✅ Initiate STK Push via Payhero
const initiatePayheroSTKPush = async (req, res) => {
  try {
    const { phone, amount, id } = req.body;

    if (!phone || !amount || !id) {
      return res.status(400).json({
        success: false,
        message: "Phone, amount, and user ID are required.",
      });
    }

    const formattedPhone = phone.startsWith("0")
      ? `254${phone.slice(1)}`
      : phone;

    const response = await axios.post(
      "https://backend.payhero.co.ke/api/v2/payments",
      {
        amount: parseInt(amount),
        phone_number: formattedPhone,
        channel_id: 2409,
        provider: "m-pesa",
        external_reference: `INV-${id}`,
        callback_url:
          process.env.PAYMENT_CALLBACK_URL ||
          "https://monster-tipster.onrender.com/api/payment/callback",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${encodedCredentials}`,
        },
      }
    );

    // Save initial payment (status: QUEUED)
await Payments.create({
  amount,
  phoneNumber: formattedPhone,
  status: "QUEUED",
  reference: `INV-${id}`,
  checkoutRequestId: response.data.CheckoutRequestID,
  userId: id,
});


    return res.status(200).json({
      success: true,
      message: "STK Push sent. Check your phone.",
      data: response.data,
    });
  } catch (error) {
    console.error("STK Error:", error?.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message:
        error?.response?.data?.message ||
        "Failed to initiate payment. Try again.",
    });
  }
};

// ✅ Handle Payhero payment callback
const handleCallback = async (req, res) => {
  try {
    const callbackData = req.body;

    if (!callbackData.response) {
      return res.status(400).json({
        success: false,
        message: "Invalid callback data.",
      });
    }

    const items = callbackData.response;

    const {
      Amount: amount,
      Phone: phoneNumber,
      Status: status,
      MpesaReceiptNumber: mpesaReceiptNumber,
      CheckoutRequestID: checkoutRequestId,
      ExternalReference: reference,
    } = items;
const userId = reference.split("-")[1];
  
    const user = await Users.findOne({ where: { id: userId } });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const daysToAdd = PAYMENT_TIERS[amount];
    if (!daysToAdd) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment amount.",
      });
    }

    const accessExpiration = moment().add(daysToAdd, "days").toDate();

    // Update user access
    await user.update({
      userType: "vip",
      accessExpiration,
    });

   const payment = await Payments.findOne({
  where: {
    reference,
    checkoutRequestId,
  },
});

if (payment) {
  await payment.update({
    status,
    mpesaReceiptNumber,
  });
} else {
  // If payment wasn't saved earlier, create a new one (as a fallback)
  await Payments.create({
    amount,
    phoneNumber,
    status,
    reference,
    checkoutRequestId,
    mpesaReceiptNumber,
    userId: user.id,
  });
}


    return res.status(200).json({
      success: true,
      message: "Payment processed. VIP access granted.",
      data: payment,
    });
  } catch (error) {
    console.error("Callback Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to handle callback.",
    });
  }
};

const getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payments.findAll();

    return res.status(200).json({
      success: true,
      message: "Payment history retrieved successfully.",
      data: payments,
    });
  } catch (error) {
    console.error("Payment history error:", error.message);
  }
}

module.exports = {
  initiatePayheroSTKPush,
  handleCallback,
  getPaymentHistory
};
