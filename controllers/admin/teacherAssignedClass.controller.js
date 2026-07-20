import {

    getAllTeacherAssignedClasses,

    createTeacherAssignedClass,

    deleteTeacherAssignedClass

}
from "../../models/admin/teacherAssignedClass.model.js";


// Get All Assignments

export const fetchTeacherAssignedClasses = async(req,res)=>{


    try{


        const assignments =
        await getAllTeacherAssignedClasses();



        return res.status(200).json({

            message:
            "Teacher assignments fetched successfully",

            assignments

        });



    }catch(error){


        console.error(
            "Fetch Assignment Error:",
            error.message
        );



        return res.status(500).json({

            message:
            "Internal Server Error"

        });


    }


};







// Assign Teacher

export const assignTeacherClass = async(req,res)=>{


    try{


        const {

            teacher_number,

            class_id,

            section_id,

            subject_id,

            session_id


        } = req.body;




        if(

            !teacher_number ||

            !class_id ||

            !section_id ||

            !subject_id ||

            !session_id

        ){

            return res.status(400).json({

                message:
                "All fields are required"

            });

        }






        const assignment =

        await createTeacherAssignedClass({

            teacher_number,

            class_id,

            section_id,

            subject_id,

            session_id

        });






        return res.status(201).json({

            message:
            "Teacher assigned successfully",

            assignment

        });




    }catch(error){


        console.error(
            "Assign Teacher Error:",
            error.message
        );



        // Duplicate assignment
        if(error.code==="23505"){

            return res.status(409).json({

                message:
                "Teacher already assigned for this class subject"

            });

        }




        return res.status(500).json({

            message:
            "Internal Server Error"

        });


    }


};









// Delete Assignment

export const removeTeacherAssignment = async(req,res)=>{


    try{


        const {
            id
        } = req.params;



        const deleted =

        await deleteTeacherAssignedClass(id);




        if(!deleted){


            return res.status(404).json({

                message:
                "Assignment not found"

            });


        }




        return res.status(200).json({

            message:
            "Assignment deleted successfully"

        });



    }catch(error){


        console.error(
            "Delete Assignment Error:",
            error.message
        );



        return res.status(500).json({

            message:
            "Internal Server Error"

        });


    }


};