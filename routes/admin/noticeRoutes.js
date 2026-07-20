import express from "express";
import { getNotices, addNotice, deleteNotice, upload } from "../../controllers/admin/noticeController.js";

const router = express.Router();

// Use multer upload middleware for image/attachment
router.post("/", upload.fields([
  { name: "image", maxCount: 1 },
  { name: "attachment", maxCount: 1 },
]), addNotice);

router.get("/", getNotices);
router.delete("/:id", deleteNotice);

export default router;