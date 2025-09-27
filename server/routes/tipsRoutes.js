const express = require("express");
const { isAdmin, verifyToken } = require("../middlewares/AuthMiddleware");
const {
  deleteTip,
  createTips,
  updateTip,
  getTipById,
  getTips,
} = require("../controllers/tipsController");

const router = express.Router();

router.delete("/delete/:tipId", isAdmin, deleteTip);
router.get("/get", verifyToken, getTips);
router.post("/create", isAdmin, createTips);
router.put("/update/:tipId", isAdmin, updateTip);
router.get("/get/:tipId", verifyToken, getTipById);

module.exports = router;
