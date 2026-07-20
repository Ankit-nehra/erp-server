import express from "express";

import {
    teacherLogin,
    fetchAllTeachers
} from "../../controllers/teacher/teacherLogin.controller.js";


const router = express.Router();



router.post(
    "/teacher",
    teacherLogin
);



router.get(
    "/teachers",
    fetchAllTeachers
);
// {
//     "message":"Teachers fetched successfully",
//     "teachers":[
//         {
//             "teacher_number":"T001",
//             "teacher_name":"Rahul Sharma"
//         },
//         {
//             "teacher_number":"T002",
//             "teacher_name":"Amit Kumar"
//         }
//     ]
// }



export default router;
