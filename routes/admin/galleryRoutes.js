import express from "express";
import multer from "multer";
import path from "path";
import { protect } from "../../middleware/adminAuthMiddleware.js";
import { getImages, addImage, deleteImage } from "../../controllers/admin/galleryController.js";

const router = express.Router();

// ✅ Storage configuration
const storage = multer.memoryStorage();

// ✅ File filter (allow only images)
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/gif",
    "image/webp"
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, PNG, GIF, WEBP images are allowed"), false);
  }
};

// ✅ Multer setup
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

// ---------------------- Routes ----------------------

// GET all images
router.get("/", getImages);

// POST upload image
router.post("/", protect, (req, res) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    addImage(req, res);
  });
});

// DELETE image
router.delete("/:id", protect, deleteImage);

export default router;
