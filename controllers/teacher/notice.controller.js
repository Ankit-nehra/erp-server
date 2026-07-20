import noticesModel from "../../models/teacher/noticesModel.js";





/**
 * Create Notice
 */
export const createNotice = async (
    req,
    res
) => {


    try {


        const teacher_number =
            req.user.teacherNumber;



        const {
            session_id,
            class_id,
            section_id,
            title,
            description
        } = req.body;


console.log("ASSIGNMENT CHECK DATA:", {
    teacher_number,
    session_id,
    class_id,
    section_id
});

        if (
            !session_id ||
            !class_id ||
            !section_id ||
            !title ||
            !description
        ) {

            return res.status(400).json({

                success:false,

                message:"All fields are required"

            });

        }





        const isAssigned =
            await noticesModel.checkTeacherClassAssignment({

                teacher_number,

                session_id,

                class_id,

                section_id

            });





        if(!isAssigned){

            return res.status(403).json({

                success:false,

                message:
                "You are not assigned to this class"

            });

        }







        const notice =
            await noticesModel.createNotice({

                session_id,

                class_id,

                section_id,

                teacher_number,

                title:title.trim(),

                description:description.trim()

            });






        return res.status(201).json({

            success:true,

            message:"Notice published successfully",

            data:notice

        });



    }
    catch(error){


        console.error(
            "Create Notice Error:",
            error
        );


        return res.status(500).json({

            success:false,

            message:"Internal server error"

        });


    }


};









/**
 * Get Teacher Notices
 */
export const getTeacherNotices = async (
    req,
    res
) => {


    try {


        console.log(
            "GET NOTICE CONTROLLER HIT"
        );


        console.log(
            "REQ USER:",
            req.user
        );



        const teacher_number =
            req.user.teacherNumber;





        const notices =
            await noticesModel.getTeacherNotices(
                teacher_number
            );





        return res.status(200).json({

            success:true,

            count:notices.length,

            data:notices

        });



    }
    catch(error){


        console.error(
            "Get Notice Error:",
            error
        );


        return res.status(500).json({

            success:false,

            message:"Internal server error"

        });


    }


};









/**
 * Delete Notice
 */
export const deleteNotice = async (
    req,
    res
) => {


    try {


        const teacher_number =
            req.user.teacherNumber;



        const { id } =
            req.params;





        const deletedNotice =
            await noticesModel.deleteNotice({

                notice_id:id,

                teacher_number

            });






        if(!deletedNotice){


            return res.status(404).json({

                success:false,

                message:"Notice not found"

            });

        }







        return res.status(200).json({

            success:true,

            message:"Notice deleted successfully"

        });




    }
    catch(error){


        console.error(
            "Delete Notice Error:",
            error
        );



        return res.status(500).json({

            success:false,

            message:"Internal server error"

        });


    }


};









/**
 * Get Assigned Classes
 */
export const getAssignedClasses = async (
    req,
    res
) => {


    try {
 console.log(
            "Teacher Number:",
            req.user.teacher_number
        );

        const teacher_number =
            req.user.teacherNumber;





        const classes =
            await noticesModel.getTeacherAssignedClasses(
                teacher_number
            );







        return res.status(200).json({

            success:true,

            data:classes

        });



    }
    catch(error){


        console.error(
            "Assigned Class Error:",
            error
        );



        return res.status(500).json({

            success:false,

            message:"Internal server error"

        });


    }


};