import {

    getAllClassSectionSubjectMappings,
    createClassSectionSubjectMapping,
    deleteClassSectionSubjectMapping,
    getSectionsByClassId,
    getSubjectsByClassAndSection

} from "../../models/admin/classSectionSubjectMapping.model.js";



// Get All Mappings
export const fetchClassSectionSubjectMappings = async (req, res) => {

    try {

        const mappings =
            await getAllClassSectionSubjectMappings();

        return res.status(200).json({

            message: "Class Section Subject Mappings fetched successfully",

            mappings

        });

    }

    catch (error) {

        console.log(error);

        return res.status(500).json({

            message: "Internal Server Error"

        });

    }

};

// Get Sections By Class
export const fetchSectionsByClass = async (req, res) => {

    try {

        const { class_id } = req.params;

        const sections = await getSectionsByClassId(class_id);

        return res.status(200).json({

            message: "Sections fetched successfully",

            sections

        });

    }

    catch (error) {

        console.log(error);

        return res.status(500).json({

            message: "Internal Server Error"

        });

    }

};

// Get Subjects By Class & Section
export const fetchSubjectsByClassAndSection = async (req, res) => {

    try {

        const {

            class_id,

            section_id

        } = req.params;

        const subjects = await getSubjectsByClassAndSection(

            class_id,

            section_id

        );

        return res.status(200).json({

            message: "Subjects fetched successfully",

            subjects

        });

    }

    catch (error) {

        console.log(error);

        return res.status(500).json({

            message: "Internal Server Error"

        });

    }

};


// Create Mapping
export const addClassSectionSubjectMapping = async (req, res) => {

    try {

        const {

            class_id,
            section_id,
            subject_id

        } = req.body;



        if (

            !class_id ||

            !section_id ||

            !subject_id

        ) {

            return res.status(400).json({

                message: "Class, Section and Subject are required."

            });

        }



        const mapping =
            await createClassSectionSubjectMapping({

                class_id,
                section_id,
                subject_id

            });



        return res.status(201).json({

            message: "Subject mapped successfully.",

            mapping

        });

    }

    catch (error) {

        console.log(error);



        if (error.code === "23505") {

            return res.status(409).json({

                message: "This subject is already mapped with the selected Class and Section."

            });

        }



        return res.status(500).json({

            message: "Internal Server Error"

        });

    }

};




// Delete Mapping
export const removeClassSectionSubjectMapping = async (req, res) => {

    try {

        const { id } = req.params;



        const mapping =
            await deleteClassSectionSubjectMapping(id);



        if (!mapping) {

            return res.status(404).json({

                message: "Mapping not found."

            });

        }



        return res.status(200).json({

            message: "Mapping deleted successfully."

        });

    }

    catch (error) {

        console.log(error);

        return res.status(500).json({

            message: "Internal Server Error"

        });

    }

};