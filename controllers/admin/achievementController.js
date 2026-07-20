import Achievement from "../../models/admin/Achievement.js";
import multer from "multer";
import streamifier from "streamifier";
import cloudinary from "../../config/cloudinary.js";

/* ================= MULTER ================= */

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files are allowed"), false);
  }

  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
});

/* ================= CLOUDINARY ================= */

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "achievements",
        resource_type: "image",
        use_filename: true,
        unique_filename: false,
      },
      (err, result) => {
        if (err) return reject(err);

        resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

/* ================= ADD ================= */

export const addAchievement = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      studentName,
      studentClass,
      achievementDate,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "Title and Description are required",
      });
    }

    let image = "";
    let publicId = "";

    if (req.file) {
      const uploaded = await uploadToCloudinary(req.file.buffer);

      image = uploaded.secure_url;
      publicId = uploaded.public_id;
    }

    const achievement = await Achievement.create({
      title,
      description,
      category,
      studentName,
      studentClass,
      achievementDate,
      image,
      public_id: publicId,
    });

    res.status(201).json(achievement);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message,
    });
  }
};

/* ================= GET ================= */

export const getAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find().sort({
      createdAt: -1,
    });

    res.json(achievements);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

/* ================= DELETE ================= */

export const deleteAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);

    if (!achievement) {
      return res.status(404).json({
        message: "Achievement not found",
      });
    }

    if (achievement.public_id) {
      await cloudinary.uploader.destroy(achievement.public_id, {
        resource_type: "image",
      });
    }

    await Achievement.findByIdAndDelete(req.params.id);

    res.json({
      message: "Achievement deleted successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
};