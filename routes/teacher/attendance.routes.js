import express from "express";

import {
    getAttendanceOptions,
    getAttendanceStudents,
    createAttendance,
    deleteAttendance
} from "../../controllers/teacher/attendance.controller.js";


import {
    verifyTeacherToken
} from "../../middleware/teacherAuthMiddleware.js";


const router = express.Router();



//----------------------------------------------------
// Get teacher assigned class-section-subject
//----------------------------------------------------

router.get(
    "/options",
    verifyTeacherToken,
    getAttendanceOptions
);




//----------------------------------------------------
// Get students for attendance
//----------------------------------------------------

router.get(
    "/students",
    verifyTeacherToken,
    getAttendanceStudents
);




//----------------------------------------------------
// Submit attendance
//----------------------------------------------------

router.post(
    "/",
    verifyTeacherToken,
    createAttendance
);




//----------------------------------------------------
// Delete attendance
//----------------------------------------------------

router.delete(
    "/:attendanceId",
    verifyTeacherToken,
    deleteAttendance
);



export default router;