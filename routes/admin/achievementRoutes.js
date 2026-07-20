import express from "express";

import {
  addAchievement,
  getAchievements,
  deleteAchievement,
  upload,
} from "../../controllers/admin/achievementController.js";

const router = express.Router();

/* GET ALL */
router.get("/", getAchievements);

/* ADD */
router.post("/", upload.single("image"), addAchievement);

/* DELETE */
router.delete("/:id", deleteAchievement);

export default router;