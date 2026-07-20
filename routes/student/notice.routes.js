import express from "express";


import {

getStudentNotices

}

from "../../controllers/student/notice.controller.js";


import {

verifyStudentToken

}

from "../../middleware/studentAuthMiddleware.js";



const router = express.Router();



router.get(

"/",

verifyStudentToken,

getStudentNotices

);



export default router;