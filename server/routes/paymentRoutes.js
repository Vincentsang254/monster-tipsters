/** @format */
const express = require("express");
const { initiatePayheroSTKPush, handleCallback, getPaymentHistory, getPaymentStatus } = require("../controllers/payheroController");
const { verifyToken, isAdmin } = require("../middlewares/AuthMiddleware");


const router = express.Router();


router.post("/stkpush", verifyToken, initiatePayheroSTKPush);
router.post("/callback", handleCallback);
router.get("/history", isAdmin,getPaymentHistory );
router.get("/status/:checkoutId", getPaymentStatus);


module.exports = router;
