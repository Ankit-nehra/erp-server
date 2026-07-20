import express from "express";

import {
    fetchStudentTimetable
} from "../../controllers/student/timetable.controller.js";

import {verifyStudentToken} from "../../middleware/studentAuthMiddleware.js";

const router = express.Router();

router.get(
    "/",
    verifyStudentToken,
    fetchStudentTimetable
);

export default router;