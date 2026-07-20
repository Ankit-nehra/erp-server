import express from "express";


import {

    getStudentOptions,

    getTeacherStudents

}
from "../../controllers/teacher/students.controller.js";



import {

    verifyTeacherToken
    
}
from "../../middleware/teacherAuthMiddleware.js";





const router = express.Router();






/*
|--------------------------------------------------------------------------
| Get Teacher Assigned Class + Section Options
|--------------------------------------------------------------------------
|
| Used in Students Page dropdown
|
| GET:
| /api/teacher/students/options
|
*/

router.get(

    "/options",

    verifyTeacherToken,

    getStudentOptions

);









/*
|--------------------------------------------------------------------------
| Get Students By Class + Section
|--------------------------------------------------------------------------
|
| Query Params:
|
| class_id
| section_id
|
| GET:
| /api/teacher/students
|
| Response:
|
| summary:
|   total_students
|   total_boys
|   total_girls
|   class_attendance
|
| students:
|   profile_photo
|   student details
|   attendance %
|
|--------------------------------------------------------------------------
*/

router.get(

    "/",

    verifyTeacherToken,

    getTeacherStudents

);








export default router;