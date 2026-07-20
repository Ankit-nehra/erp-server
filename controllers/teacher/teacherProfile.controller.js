import {

    findTeacherProfileByNumber,

    getTeacherDashboardStats,

    getTeacherAssignedClasses

}
from "../../models/teacher/teacherProfile.model.js";





export const getTeacherProfile = async(
    req,
    res
)=>{


    try{


        const teacherNumber =
        req.user.teacherNumber;



        if(!teacherNumber){


            return res.status(400).json({

                success:false,

                message:
                "Teacher number missing in token"

            });


        }





        const profile =
        await findTeacherProfileByNumber(
            teacherNumber
        );





        if(!profile){


            return res.status(404).json({

                success:false,

                message:
                "Teacher profile not found"

            });


        }





        const dashboard =
        await getTeacherDashboardStats(
            teacherNumber
        );





        const classes =
        await getTeacherAssignedClasses(
            teacherNumber
        );







        return res.status(200).json({


            success:true,


            profile,


            dashboard,


            classes



        });





    }
    catch(error){



        console.log(
            "Teacher Profile Error:",
            error
        );



        return res.status(500).json({

            success:false,

            message:
            "Internal Server Error"

        });



    }



};