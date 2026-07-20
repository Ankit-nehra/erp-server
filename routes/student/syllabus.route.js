import express from "express";


import {

getStudentSyllabus

}
from "../../controllers/student/syllabus.controller.js";


import {

verifyStudentToken

}
from "../../middleware/studentAuthMiddleware.js";



const router = express.Router();



router.get(

"/",

verifyStudentToken,

getStudentSyllabus

);



export default router;