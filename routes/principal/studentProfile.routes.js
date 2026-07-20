import express from "express";


import {

    verifyPrincipalToken

}
from "../../middleware/principalAuthMiddleware.js";



import {

    getPrincipalStudentProfile

}
from "../../controllers/principal/studentProfile.controller.js";





const router = express.Router();







/*
|--------------------------------------------------------------------------
| Get Student Complete Profile
|--------------------------------------------------------------------------
|
| GET
|
| /principal/student-profile/:admission_number
|
*/

router.get(

    "/:admission_number",

    verifyPrincipalToken,

    getPrincipalStudentProfile

);







export default router;