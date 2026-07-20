import express from "express";

import {

    getAssignedOptions,
    createSyllabus,
    getTeacherSyllabus,
    updateSyllabusStatus,
    deleteSyllabus

} from "../../controllers/teacher/syllabus.controller.js";

import {verifyTeacherToken} from "../../middleware/teacherAuthMiddleware.js";
        
const router = express.Router();


/* ===========================================================
   GET ASSIGNED CLASS / SUBJECT / SECTION / SESSION
=========================================================== */

router.get(
    "/options",
    verifyTeacherToken,
    getAssignedOptions
);


/* ===========================================================
   CREATE SYLLABUS
=========================================================== */

router.post(
    "/",
    verifyTeacherToken,
    createSyllabus
);


/* ===========================================================
   GET TEACHER SYLLABUS
=========================================================== */

router.get(
    "/",
    verifyTeacherToken,
    getTeacherSyllabus
);


/* ===========================================================
   UPDATE STATUS ONLY
=========================================================== */

router.patch(
    "/:id",
    verifyTeacherToken,
    updateSyllabusStatus
);


/* ===========================================================
   DELETE
=========================================================== */

router.delete(
    "/:id",
    verifyTeacherToken,
    deleteSyllabus
);

export default router;