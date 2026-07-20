import {

    getAssignedOptionsModel,
    createSyllabusModel,
    getTeacherSyllabusModel,
    updateSyllabusStatusModel,
    deleteSyllabusModel,
    isTeacherAssignedModel

} from "../../models/teacher/syllabus.model.js"


/* ===========================================================
   GET ASSIGNED CLASS / SUBJECT / SECTION / SESSION
=========================================================== */

export const getAssignedOptions = async (req, res) => {

    try {

        const teacherNumber = req.user.teacherNumber;
        console.log("teacher number ye hai :"+teacherNumber);
        const data = await getAssignedOptionsModel(teacherNumber);

        return res.status(200).json({

            success: true,
            data

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,
            message: "Internal Server Error"

        });

    }

};


/* ===========================================================
   CREATE SYLLABUS
=========================================================== */

export const createSyllabus = async (req, res) => {

    try {

        const teacherNumber = req.user.teacherNumber;

        const {

            session_id,
            class_id,
            section_id,
            subject_id,
            chapter_title,
            description,
            completion_date,
            status

        } = req.body;

        /* ---------- Validation ---------- */

        if (

            !session_id ||
            !class_id ||
            !section_id ||
            !subject_id ||
            !chapter_title ||
            !status

        ) {

            return res.status(400).json({

                success: false,
                message: "Please fill all required fields."

            });

        }


        /* ---------- Status Validation ---------- */

        const allowedStatus = [

            "Pending",
            "In Progress",
            "Completed"

        ];

        if (!allowedStatus.includes(status)) {

            return res.status(400).json({

                success: false,
                message: "Invalid Status"

            });

        }


        /* ---------- Verify Teacher Assignment ---------- */

        const assigned = await isTeacherAssignedModel(

            teacherNumber,
            session_id,
            class_id,
            section_id,
            subject_id

        );

        if (!assigned) {

            return res.status(403).json({

                success: false,
                message: "You are not assigned to this class."

            });

        }


        /* ---------- Insert ---------- */

        const syllabus = await createSyllabusModel({

            teacherNumber,
            session_id,
            class_id,
            section_id,
            subject_id,
            chapter_title,
            description,
            completion_date,
            status

        });

        return res.status(201).json({

            success: true,
            message: "Syllabus Uploaded Successfully",

            data: syllabus

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,
            message: "Internal Server Error"

        });

    }

};



/* ===========================================================
   GET ALL SYLLABUS
=========================================================== */

export const getTeacherSyllabus = async (req, res) => {

    try {

        const teacherNumber = req.user.teacherNumber;

        const data = await getTeacherSyllabusModel(teacherNumber);

        return res.status(200).json({

            success: true,
            data

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,
            message: "Internal Server Error"

        });

    }

};



/* ===========================================================
   UPDATE STATUS
=========================================================== */

export const updateSyllabusStatus = async (req, res) => {

    try {

        const teacherNumber = req.user.teacherNumber;

        const { id } = req.params;

        const { status } = req.body;


        if (!status) {

            return res.status(400).json({

                success: false,
                message: "Status Required"

            });

        }


        const allowed = [

            "Pending",
            "In Progress",
            "Completed"

        ];

        if (!allowed.includes(status)) {

            return res.status(400).json({

                success: false,
                message: "Invalid Status"

            });

        }


        const updated = await updateSyllabusStatusModel(

            id,
            teacherNumber,
            status

        );


        if (!updated) {

            return res.status(404).json({

                success: false,
                message: "Syllabus Not Found"

            });

        }


        return res.status(200).json({

            success: true,
            message: "Status Updated",

            data: updated

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,
            message: "Internal Server Error"

        });

    }

};



/* ===========================================================
   DELETE
=========================================================== */

export const deleteSyllabus = async (req, res) => {

    try {

        const teacherNumber = req.user.teacherNumber;

        const { id } = req.params;

        const deleted = await deleteSyllabusModel(

            id,
            teacherNumber

        );

        if (!deleted) {

            return res.status(404).json({

                success: false,
                message: "Syllabus Not Found"

            });

        }

        return res.status(200).json({

            success: true,
            message: "Syllabus Deleted Successfully"

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,
            message: "Internal Server Error"

        });

    }

};