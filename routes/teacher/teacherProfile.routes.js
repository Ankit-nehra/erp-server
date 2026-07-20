import express from "express";
import { getTeacherProfile } from "../../controllers/teacher/teacherProfile.controller.js";
import { verifyTeacherToken } from "../../middleware/teacherAuthMiddleware.js";


const router = express.Router();


router.get(
    "/",
    verifyTeacherToken,
    getTeacherProfile
);




export default router;