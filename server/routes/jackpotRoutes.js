const { getJackpot, createJackpot, updateJackpot, getJackpotById, deleteJackpot } = require("../controllers/jackpotController");
const { verifyToken, isAdmin } = require("../middlewares/AuthMiddleware");
const express = require("express");

const router = express.Router();

router.get("/get", verifyToken, getJackpot);

router.post("/create", isAdmin, createJackpot);
router.put("/update/:jackpotId", isAdmin, updateJackpot);
router.get("/get/:jackpotId", verifyToken, getJackpotById);
router.delete("/delete/:jackpotId", isAdmin, deleteJackpot);

module.exports = router;
