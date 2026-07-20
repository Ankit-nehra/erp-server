import {
    getAllSections,
    createSection,
    deleteSection,
} from "../../models/admin/section.model.js";



// Fetch All Sections
export const fetchSections = async (req, res) => {

    try {

        const sections =
            await getAllSections();


        return res.status(200).json({

            message:
            "Sections fetched successfully",

            sections

        });


    } catch(error){

        console.error(
            "Fetch Section Error:",
            error.message
        );


        return res.status(500).json({

            message:
            "Internal Server Error"

        });

    }

};





// Add Section
export const addSection = async (req,res)=>{

    try {

        const {
            section_name
        } = req.body;



        if(!section_name){

            return res.status(400).json({

                message:
                "Section name required"

            });

        }



        const section =
            await createSection(
                section_name
            );



        return res.status(201).json({

            message:
            "Section created successfully",

            section

        });



    } catch(error){


        console.error(
            "Create Section Error:",
            error.message
        );



        // PostgreSQL duplicate error
        if(error.code === "23505"){

            return res.status(409).json({

                message:
                "Section already exists"

            });

        }



        return res.status(500).json({

            message:
            "Internal Server Error"

        });


    }

};






// Delete Section
export const removeSection = async(req,res)=>{

    try{


        const {
            id
        } = req.params;



        const deletedSection =
            await deleteSection(id);



        if(!deletedSection){

            return res.status(404).json({

                message:
                "Section not found"

            });

        }



        return res.status(200).json({

            message:
            "Section deleted successfully"

        });



    }catch(error){


        console.error(
            "Delete Section Error:",
            error.message
        );



        return res.status(500).json({

            message:
            "Internal Server Error"

        });


    }

};