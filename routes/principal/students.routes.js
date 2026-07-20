import express from "express";


import {

    verifyPrincipalToken

} from "../../middleware/principalAuthMiddleware.js";



import {

    getPrincipalStudentOptions,

    getPrincipalStudents

}
from "../../controllers/principal/students.controller.js";




const router = express.Router();


/*
|--------------------------------------------------------------------------
| Principal Students List
|--------------------------------------------------------------------------
|
| GET
| /principal/students
|
| Query:
|
| session_id
| class_id
| section_id
|
*/


router.get(

    "/",

    verifyPrincipalToken,

    getPrincipalStudents

);


/*
|--------------------------------------------------------------------------
| Principal Student Options
|--------------------------------------------------------------------------
|
| GET
| /principal/students/options
|
| Returns:
| Sessions
| Classes
| Sections
|
*/

router.get(

    "/options",

    verifyPrincipalToken,

    getPrincipalStudentOptions

);



export default router;