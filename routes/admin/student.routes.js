import express from "express";


import {

    fetchClasses,

    fetchSections,

    addStudent,

    fetchStudents,

    fetchStudentDetail,

    editStudent,

    removeStudent


}
from "../../controllers/admin/student.controller.js";



const router = express.Router();







/*
|--------------------------------------------------------------------------
| Admission Portal Routes
|--------------------------------------------------------------------------
*/







/*
|--------------------------------------------------------------------------
| Get Classes
|--------------------------------------------------------------------------
|
| Admin student add karte time class select karega
|
*/


router.get(

    "/classes",

    fetchClasses

);









/*
|--------------------------------------------------------------------------
| Get Sections
|--------------------------------------------------------------------------
|
| Class ke according sections
|
*/


router.get(

    "/sections",

    fetchSections

);









/*
|--------------------------------------------------------------------------
| Add New Student
|--------------------------------------------------------------------------
|
| Student Login + Student Profile create hoga
|
*/


router.post(

    "/",

    addStudent

);









/*
|--------------------------------------------------------------------------
| Get All Students
|--------------------------------------------------------------------------
|
| Admin dashboard list
|
*/


router.get(

    "/",

    fetchStudents

);









/*
|--------------------------------------------------------------------------
| Get Single Student Profile
|--------------------------------------------------------------------------
|
| View button click
|
*/


router.get(

    "/:id",

    fetchStudentDetail

);









/*
|--------------------------------------------------------------------------
| Update Student
|--------------------------------------------------------------------------
|
| Edit admission details
|
*/


router.put(

    "/:id",

    editStudent

);









/*
|--------------------------------------------------------------------------
| Delete Student
|--------------------------------------------------------------------------
|
| Remove admission
|
*/


router.delete(

    "/:id",

    removeStudent

);






export default router;