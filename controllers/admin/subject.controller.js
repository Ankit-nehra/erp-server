import {
    getAllSubjects,
    createSubject,
    deleteSubject
} from "../../models/admin/subject.model.js";



// Fetch Subjects
export const fetchSubjects = async(req,res)=>{

    try{

        const subjects =
            await getAllSubjects();


        return res.status(200).json({

            message:
            "Subjects fetched successfully",

            subjects

        });


    }catch(error){

        console.error(
            "Fetch Subject Error:",
            error.message
        );


        return res.status(500).json({

            message:
            "Internal Server Error"

        });

    }

};





// Add Subject
export const addSubject = async(req,res)=>{

    try{


        const {
            subject_name,
            subject_code
        } = req.body;



        if(!subject_name){

            return res.status(400).json({

                message:
                "Subject name required"

            });

        }



        const subject =
            await createSubject({

                subject_name:
                subject_name.trim(),

                subject_code:
                subject_code?.trim() || null

            });



        return res.status(201).json({

            message:
            "Subject created successfully",

            subject

        });



    }catch(error){


        console.error(
            "Create Subject Error:",
            error.message
        );


        if(error.code==="23505"){

            return res.status(409).json({

                message:
                "Subject code already exists"

            });

        }



        return res.status(500).json({

            message:
            "Internal Server Error"

        });


    }

};






// Delete Subject
export const removeSubject = async(req,res)=>{

    try{


        const {
            id
        } = req.params;



        const deletedSubject =
            await deleteSubject(id);



        if(!deletedSubject){

            return res.status(404).json({

                message:
                "Subject not found"

            });

        }



        return res.status(200).json({

            message:
            "Subject deleted successfully"

        });



    }catch(error){


        console.error(
            "Delete Subject Error:",
            error.message
        );


        return res.status(500).json({

            message:
            "Internal Server Error"

        });


    }

};