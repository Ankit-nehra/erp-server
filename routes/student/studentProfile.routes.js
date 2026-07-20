import express from "express";
import { getStudentProfile } from "../../controllers/student/studentProfile.controller.js";
import { verifyStudentToken } from "../../middleware/studentAuthMiddleware.js";


const router = express.Router();


 router.get(
     "/",
     verifyStudentToken,
     getStudentProfile
 );


export default router;