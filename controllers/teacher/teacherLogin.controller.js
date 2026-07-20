import jwt from "jsonwebtoken";
import { findTeacherByNumber,getAllTeachers } from "../../models/teacher/teacherLogin.model.js";
// import {
//     getAllTeachers
// } from "../../models/teacher/teacherLogin.model.js";


export const teacherLogin = async (req, res) => {

    try {

        const { teacherId, password } = req.body;
   

        if (!teacherId || !password) {
            return res.status(400).json({
                message: "Teacher ID and Password are required"
            });
        }


        const teacher = await findTeacherByNumber(
            teacherId
        );

        
        if (!teacher) {
            return res.status(401).json({
                message: "Teacher not found"
            });
        }
        console.log("teacher found now password matching ...");

        if (teacher.password !== password) {
            return res.status(401).json({
                message: "Invalid Password"
            });
        }
        console.log("password matched .... now jwt creating");


        // JWT Token Generate

        const token = jwt.sign(
            {
                id: teacher.id,
                teacherNumber: teacher.teacher_number,
                role: "teacher"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRE
            }
        );


        return res.status(200).json({

            message: "Teacher Login Successful",

            token,

            teacher: {
                id: teacher.id,
                teacherNumber: teacher.teacher_number
            }

        });


    } catch (error) {

        console.error(
            "Teacher Login Error:",
            error.message
        );


        return res.status(500).json({
            message: "Internal Server Error"
        });

    }

};

export const fetchAllTeachers = async (req,res)=>{

    try {


        const teachers =
            await getAllTeachers();



        return res.status(200).json({

            message:
            "Teachers fetched successfully",

            teachers

        });



    } catch(error){


        console.error(
            "Fetch Teachers Error:",
            error.message
        );



        return res.status(500).json({

            message:
            "Internal Server Error"

        });


    }

};