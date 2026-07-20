import {
    getTeacherTimetable
} from "../../models/teacher/timetable.model.js";

export const fetchTeacherTimetable = async (req, res) => {

    try {

        const teacherNumber = req.user.teacherNumber;

        const timetable =
            await getTeacherTimetable(teacherNumber);

        return res.status(200).json({

            success: true,

            timetable

        });

    }

    catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

};