import jwt from "jsonwebtoken";
import { findStudentByAdmissionNumber } from "../../models/student/studentLogin.model.js";


export const studentLogin = async (req, res) => {

    try {

        const { admissionNumber, password } = req.body;


        if (!admissionNumber || !password) {
            return res.status(400).json({
                message: "Admission Number and Password are required"
            });
        }


        const student = await findStudentByAdmissionNumber(
            admissionNumber
        );


        if (!student) {
            return res.status(401).json({
                message: "Student not found"
            });
        }


        if (student.password !== password) {
            return res.status(401).json({
                message: "Invalid Password"
            });
        }


        // JWT Token Generate

        const token = jwt.sign(
            {
                id: student.id,
                admissionNumber: student.admission_number,
                role: "student"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRE
            }
        );


        return res.status(200).json({

            message: "Student Login Successful",

            token,

            student: {
                id: student.id,
                admissionNumber: student.admission_number
            }

        });


    } catch (error) {

        console.error(
            "Student Login Error:",
            error.message
        );


        return res.status(500).json({
            message: "Internal Server Error"
        });

    }

};