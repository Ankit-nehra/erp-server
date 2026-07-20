import jwt from "jsonwebtoken";
import { findPrincipalByNumber } from "../../models/principal/principalLogin.model.js";


export const principalLogin = async (req, res) => {

    try {

        const { principalId, password } = req.body;
        

        if (!principalId || !password) {
            return res.status(400).json({
                message: "Principal ID and Password are required"
            });
        }


        const principal = await findPrincipalByNumber(
            principalId
        );

 
        if (!principal) {
            return res.status(401).json({
                message: "Principal not found"
            });
        }


        if (principal.password !== password) {
            return res.status(401).json({
                message: "Invalid Password"
            });
        }
        


        // JWT Token Generate

        const token = jwt.sign(
            {
                id: principal.id,
                principalNumber: principal.principal_number,
                role: "principal"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRE
            }
        );


        return res.status(200).json({

            message: "Principal Login Successful",

            token,

            principal: {
                id: principal.id,
                principalNumber: principal.principal_number
            }

        });


    } catch (error) {

        console.error(
            "Principal Login Error:",
            error.message
        );


        return res.status(500).json({
            message: "Internal Server Error"
        });

    }

};