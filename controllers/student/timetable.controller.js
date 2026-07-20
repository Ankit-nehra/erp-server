import {
    getStudentTimetable
} from "../../models/student/timetable.model.js";

export const fetchStudentTimetable = async (req, res) => {

    try {

        console.log(
"USER FROM TOKEN:",
req.user
);

        const admissionNumber = req.user.admissionNumber;

console.log(
"Admission Number:",
admissionNumber
);


        const timetable =
            await getStudentTimetable(admissionNumber);

console.log(
"TIMETABLE DATA:",
timetable
);


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