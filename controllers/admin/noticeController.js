import Notice from "../../models/admin/Notice.js";
import multer from "multer";
import streamifier from "streamifier";
import cloudinary from "../../config/cloudinary.js";

/* ================= MULTER ================= */

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "image") {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only images allowed"), false);
    }
  }

  if (file.fieldname === "attachment") {
    const allowed = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Only PDF/DOCX/XLSX allowed"), false);
    }
  }

  cb(null, true);
};

export const upload = multer({ storage, fileFilter });

/* ================= CLOUDINARY UPLOAD ================= */

const uploadToCloudinary = (buffer, folder, mimetype) => {
  return new Promise((resolve, reject) => {
    let resourceType = "image";

    const rawTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (rawTypes.includes(mimetype)) {
      resourceType = "raw";
    }

    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,

        // ✅ FIX: proper filename + no random string issue
        use_filename: true,
        unique_filename: false,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

/* ================= ADD NOTICE ================= */

export const addNotice = async (req, res) => {
  try {
    const { title, description, date, marker } = req.body;

    let imageUrl = null;
    let imageId = null;

    let attachmentUrl = null;
    let attachmentId = null;

    // IMAGE
    if (req.files?.image?.[0]) {
      const img = await uploadToCloudinary(
        req.files.image[0].buffer,
        "notices/images",
        req.files.image[0].mimetype
      );

      imageUrl = img.secure_url;
      imageId = img.public_id;
    }

    // ATTACHMENT (PDF/DOCX)
    if (req.files?.attachment?.[0]) {
      const file = await uploadToCloudinary(
        req.files.attachment[0].buffer,
        "notices/files",
        req.files.attachment[0].mimetype
      );

      attachmentUrl = file.secure_url;
      attachmentId = file.public_id;
    }

    const notice = await Notice.create({
      title,
      description,
      date,
      marker: marker === "true" || marker === true,

      image: imageUrl,
      imagePublicId: imageId,

      attachment: attachmentUrl,
      attachmentPublicId: attachmentId,
    });

    res.status(201).json(notice);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET ================= */

export const getNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ date: -1 });
    res.json(notices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= DELETE ================= */

export const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({ message: "Notice not found" });
    }

    // delete image
    if (notice.imagePublicId) {
      await cloudinary.uploader.destroy(notice.imagePublicId, {
        resource_type: "image",
      });
    }

    // delete attachment (IMPORTANT FIX)
    if (notice.attachmentPublicId) {
      await cloudinary.uploader.destroy(notice.attachmentPublicId, {
        resource_type: "raw",
      });
    }

    await Notice.findByIdAndDelete(req.params.id);

    res.json({ message: "Notice deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};