import express from "express";


import {

createNotice,

getTeacherNotices,

deleteNotice,

getAssignedClasses


}

from "../../controllers/teacher/notice.controller.js";



import {

verifyTeacherToken

}

from "../../middleware/teacherAuthMiddleware.js";



const router = express.Router();





router.post(

"/create",

verifyTeacherToken,
(req,res,next)=>{

        console.log(
            "create  route hit"
        );

        next();

    },
createNotice

);







router.get(

"/all",

verifyTeacherToken,
(req,res,next)=>{

        console.log(
            "Notice all route hit"
        );

        next();

    },

getTeacherNotices

);







router.delete(

"/delete/:id",

verifyTeacherToken,
(req,res,next)=>{

        console.log(
            "delete route hit"
        );

        next();

    },
deleteNotice

);








router.get(

"/assigned-classes",

verifyTeacherToken,

getAssignedClasses

);







export default router;