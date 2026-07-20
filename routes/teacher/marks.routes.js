import express from "express";


import {

    getMarksOptions,

    getMarksStudents,

    createMarks,

    deleteMarks

}
from "../../controllers/teacher/marks.controller.js";



import {

    verifyTeacherToken

}
from "../../middleware/teacherAuthMiddleware.js";





const router = express.Router();






/*
|--------------------------------------------------------------------------
| Get Marks Options
|--------------------------------------------------------------------------
|
| Teacher assigned:
| class
| section
| subject
|
*/


router.get(

    "/options",

    verifyTeacherToken,

    getMarksOptions

);








/*
|--------------------------------------------------------------------------
| Get Students For Marks
|--------------------------------------------------------------------------
|
| Load students
| Check existing marks
|
*/


router.get(

    "/students",

    verifyTeacherToken,

    getMarksStudents

);










/*
|--------------------------------------------------------------------------
| Submit Marks
|--------------------------------------------------------------------------
|
| Create:
| marks
| marks_detail
|
*/


router.post(

    "/",

    verifyTeacherToken,

    createMarks

);









/*
|--------------------------------------------------------------------------
| Delete Marks
|--------------------------------------------------------------------------
|
| Delete complete exam marks
|
*/


router.delete(

    "/:marksId",

    verifyTeacherToken,

    deleteMarks

);







export default router;