const { getCode, createCode, updateCode, getCodeById, deleteCode } = require("../controllers/codeController");
const { verifyToken, isAdmin } = require("../middlewares/AuthMiddleware");
const express = require("express");

const router = express.Router();

router.get("/get", verifyToken, getCode);

router.post("/create", isAdmin, createCode);
router.put("/update/:codeId", isAdmin, updateCode);
router.get("/get/:codeId", verifyToken, getCodeById);
router.delete("/delete/:codeId", isAdmin, deleteCode);

module.exports = router;
