import express from "express";
import { principalLogin } from "../../controllers/principal/principalLogin.controller.js"


const router = express.Router();


router.post(
    "/principal",
    principalLogin
);


export default router;