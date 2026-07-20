import { getPool } from "../../config/postgressSupabaseDb.js";



/*
|--------------------------------------------------------------------------
| Get Active Session
|--------------------------------------------------------------------------
*/

const getActiveSession = async () => {

    const pool = getPool();

    const query = `
        SELECT id, session_name
        FROM "sessions"
        WHERE is_active = true
        LIMIT 1
    `;


    const { rows } = await pool.query(query);


    return rows[0];

};






/*
|--------------------------------------------------------------------------
| Get Teacher Assigned Classes
|--------------------------------------------------------------------------
*/

const getTeacherAssignments = async (
    teacherNumber,
    sessionId
)=>{


    const pool = getPool();


    const query = `

        SELECT

            tac.class_id,
            c.class_name,

            tac.section_id,
            s.section_name,

            tac.subject_id,
            sub.subject_name,
            sub.subject_code


        FROM "teacherAsignedClass" tac


        JOIN classes c
            ON tac.class_id = c.id


        JOIN sections s
            ON tac.section_id = s.id


        JOIN subjects sub
            ON tac.subject_id = sub.id


        WHERE

            tac.teacher_number = $1

            AND tac.session_id = $2


        ORDER BY

            c.class_name,
            s.section_name;


    `;



    const {rows} = await pool.query(
        query,
        [
            teacherNumber,
            sessionId
        ]
    );


    return rows;


};








/*
|--------------------------------------------------------------------------
| Verify Teacher Assignment
|--------------------------------------------------------------------------
*/

const verifyTeacherAssignment = async({

teacherNumber,
sessionId,
classId,
sectionId,
subjectId

})=>{


    const pool=getPool();


    const query=`

        SELECT id

        FROM "teacherAsignedClass"

        WHERE

        teacher_number=$1

        AND session_id=$2

        AND class_id=$3

        AND section_id=$4

        AND subject_id=$5


        LIMIT 1;

    `;



    const {rows}=await pool.query(
        query,
        [
            teacherNumber,
            sessionId,
            classId,
            sectionId,
            subjectId
        ]
    );


    return rows.length>0;


};









/*
|--------------------------------------------------------------------------
| Get Students
|--------------------------------------------------------------------------
*/

const getStudents = async({

sessionName,
classId,
sectionId

})=>{


    const pool=getPool();



    const query=`

        SELECT

            sp.admission_number,

            sp.student_name,

            sp.roll_number,

            sp.profile_photo


        FROM "student_profiles" sp



        JOIN classes c

        ON c.id=$2



        JOIN sections s

        ON s.id=$3



        WHERE


            sp.session=$1


            AND sp.class_name=c.class_name


            AND sp.section=s.section_name



        ORDER BY

            sp.roll_number ASC;


    `;



    const {rows}=await pool.query(
        query,
        [
            sessionName,
            classId,
            sectionId
        ]
    );



    return rows;


};









/*
|--------------------------------------------------------------------------
| Check Existing Attendance
|--------------------------------------------------------------------------
*/

const getAttendance = async({

sessionId,
classId,
sectionId,
subjectId,
attendanceDate,
periodNumber

})=>{


    const pool=getPool();



    const query=`

        SELECT *

        FROM "attendance"


        WHERE

        session_id=$1

        AND class_id=$2

        AND section_id=$3

        AND subject_id=$4

        AND attendance_date=$5

        AND period_number=$6


        LIMIT 1;


    `;



    const {rows}=await pool.query(
        query,
        [
            sessionId,
            classId,
            sectionId,
            subjectId,
            attendanceDate,
            periodNumber
        ]
    );


    return rows[0];


};









/*
|--------------------------------------------------------------------------
| Attendance Details
|--------------------------------------------------------------------------
*/

const getAttendanceDetails = async(attendanceId)=>{


    const pool=getPool();



    const query=`

        SELECT

        sp.admission_number,

        sp.student_name,

        sp.roll_number,

        sp.profile_photo,

        ad.status


        FROM "attendance_detail" ad


        JOIN student_profiles sp

        ON sp.admission_number=
        ad.admission_number


        WHERE

        ad.attendance_id=$1


        ORDER BY

        sp.roll_number;


    `;



    const {rows}=await pool.query(
        query,
        [
            attendanceId
        ]
    );


    return rows;


};









/*
|--------------------------------------------------------------------------
| Create Attendance Record
|--------------------------------------------------------------------------
*/

const createAttendanceRecord = async(
client,
{
sessionId,
classId,
sectionId,
subjectId,
teacherNumber,
attendanceDate,
periodNumber
}
)=>{


const query=`

INSERT INTO "attendance"

(
session_id,
class_id,
section_id,
subject_id,
teacher_number,
attendance_date,
period_number
)


VALUES

($1,$2,$3,$4,$5,$6,$7)


RETURNING *;


`;



const {rows}=await client.query(
query,
[
sessionId,
classId,
sectionId,
subjectId,
teacherNumber,
attendanceDate,
periodNumber
]
);


return rows[0];


};








/*
|--------------------------------------------------------------------------
| Create Attendance Details
|--------------------------------------------------------------------------
*/

const createAttendanceDetails=async(
client,
attendanceId,
students
)=>{


const values=[];
const placeholders=[];



students.forEach((student,index)=>{


const p=index*3;



placeholders.push(
`($${p+1},$${p+2},$${p+3})`
);



values.push(

attendanceId,

student.admission_number,

student.status

);


});



const query=`

INSERT INTO "attendance_detail"

(
attendance_id,
admission_number,
status
)

VALUES

${placeholders.join(",")}


`;



await client.query(
query,
values
);


};








/*
|--------------------------------------------------------------------------
| Delete Attendance
|--------------------------------------------------------------------------
*/

const deleteAttendanceRecord=async(
attendanceId,
teacherNumber
)=>{


const pool=getPool();


const query=`

DELETE FROM "attendance"

WHERE

id=$1

AND teacher_number=$2


RETURNING id;


`;



const {rows}=await pool.query(
query,
[
attendanceId,
teacherNumber
]
);



return rows[0];


};









export {

getActiveSession,

getTeacherAssignments,

verifyTeacherAssignment,

getStudents,

getAttendance,

getAttendanceDetails,

createAttendanceRecord,

createAttendanceDetails,

deleteAttendanceRecord

};