import express from "express";
import { getPrincipalProfile } from "../../controllers/principal/principalProfile.controller.js";
import { verifyPrincipalToken } from "../../middleware/principalAuthMiddleware.js";


const router = express.Router();


router.get(
    "/profile",
    verifyPrincipalToken,
    getPrincipalProfile
);


export default router;