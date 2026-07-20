import express from "express";


import {
    fetchStudentMarks
}
from "../../controllers/student/studentMarks.controller.js";


import {

    verifyStudentToken

}
from "../../middleware/studentAuthMiddleware.js";



const router = express.Router();



router.get(

    "/marks",

    verifyStudentToken,

    fetchStudentMarks

);



export default router;