import express from "express";


import {
    getStudentAttendance,
    getStudentAttendanceHistory,
    getStudentMonthlyDetail
} from "../../controllers/student/attendance.controller.js";


import {
    verifyStudentToken
} from "../../middleware/studentAuthMiddleware.js";



const router = express.Router();





//----------------------------------------------------
// Student Attendance Dashboard
//----------------------------------------------------
//
// Summary
// Monthly
// Subject wise
//
// GET /api/student/attendance
//----------------------------------------------------

router.get(
    "/",
    verifyStudentToken,
    getStudentAttendance
);












//----------------------------------------------------
// Particular Month Detail
//----------------------------------------------------
//
// Example:
// /attendance/month/7
//
// July attendance
//
//----------------------------------------------------

router.get(
    "/month/:month",
    verifyStudentToken,
    getStudentMonthlyDetail
);




//----------------------------------------------------
// Complete Attendance History
//----------------------------------------------------
//
// Date
// Subject
// Teacher
// Period
// Status
//
// GET /api/student/attendance/history
//----------------------------------------------------

router.get(
    "/history",
    verifyStudentToken,
    getStudentAttendanceHistory
);








export default router;