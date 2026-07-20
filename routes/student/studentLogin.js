import express from "express";
import { studentLogin } from "../../controllers/student/studentLogin.controller.js";


const router = express.Router();


router.post(
    "/student",
    studentLogin
);


export default router;