// const necessary modules
const express = require("express");
const { verifyToken, isAdmin } = require("../middlewares/AuthMiddleware");
const {
  getSingleImage,
  getImages,
  imageUpload,
  deleteImage,
  updateImage,
} = require("../controllers/imageController");
const { upload } = require("../utils/cloudinary");

const router = express.Router();

router.post("/upload", upload.single("my_file"), isAdmin, imageUpload);
router.get("/get", verifyToken, getImages);
router.get("/get/:imageId", verifyToken, getSingleImage);
router.put(
  "/update/:imageId",
  upload.single("my_file"),
  isAdmin,
  updateImage
);
router.delete("/delete/:imageId", isAdmin, deleteImage);

module.exports = router;
