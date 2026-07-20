import {
    getAllClasses,
    createClass,
    deleteClass,
} from "../../models/admin/class.model.js";



// Fetch Classes
export const fetchClasses = async (req, res) => {

    try {

        const classes = await getAllClasses();


        return res.status(200).json({

            message:
            "Classes fetched successfully",

            classes

        });


    } catch (error) {


        console.error(
            "Fetch Classes Error:",
            error.message
        );


        return res.status(500).json({

            message:
            "Internal Server Error"

        });

    }

};




// Add Class
export const addClass = async (req, res) => {

    try {

        const {
            class_name
        } = req.body;



        if (!class_name) {

            return res.status(400).json({

                message:
                "Class name required"

            });

        }



        const newClass =
            await createClass(class_name);



        return res.status(201).json({

            message:
            "Class created successfully",

            class:
            newClass

        });



    } catch (error) {


        console.error(
            "Create Class Error:",
            error.message
        );


        // Duplicate value error
        if(error.code === "23505"){

            return res.status(409).json({

                message:
                "Class already exists"

            });

        }



        return res.status(500).json({

            message:
            "Internal Server Error"

        });

    }

};





// Delete Class
export const removeClass = async (req,res)=>{


    try {


        const {
            id
        } = req.params;



        const deletedClass =
            await deleteClass(id);



        if(!deletedClass){

            return res.status(404).json({

                message:
                "Class not found"

            });

        }



        return res.status(200).json({

            message:
            "Class deleted successfully"

        });



    } catch(error){


        console.error(
            "Delete Class Error:",
            error.message
        );



        return res.status(500).json({

            message:
            "Internal Server Error"

        });


    }

};