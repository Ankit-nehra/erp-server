import { getPool } from "../../config/postgressSupabaseDb.js";



/*
|--------------------------------------------------------------------------
| Get Active Session
|--------------------------------------------------------------------------
*/

const getActiveSession = async () => {

    const pool = getPool();


    const query = `

        SELECT

            id,

            session_name

        FROM "sessions"

        WHERE is_active = true

        LIMIT 1;

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

) => {


    const pool = getPool();



    const query = `


        SELECT DISTINCT


            tac.class_id,


            c.class_name,


            tac.section_id,


            s.section_name



        FROM "teacherAsignedClass" tac



        JOIN classes c

        ON c.id = tac.class_id



        JOIN sections s

        ON s.id = tac.section_id



        WHERE


            tac.teacher_number = $1


            AND tac.session_id = $2



        ORDER BY


            c.class_name,


            s.section_name;


    `;



    const { rows } = await pool.query(

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

const verifyTeacherAssignment = async ({

    teacherNumber,

    sessionId,

    classId,

    sectionId


}) => {


    const pool = getPool();



    const query = `


        SELECT id


        FROM "teacherAsignedClass"


        WHERE


            teacher_number = $1


            AND session_id = $2


            AND class_id = $3


            AND section_id = $4



        LIMIT 1;


    `;



    const { rows } = await pool.query(

        query,

        [

            teacherNumber,

            sessionId,

            classId,

            sectionId

        ]

    );



    return rows.length > 0;


};









/*
|--------------------------------------------------------------------------
| Get Students With Attendance Percentage
|--------------------------------------------------------------------------
*/

const getStudents = async ({

    sessionName,

    classId,

    sectionId


}) => {


    const pool = getPool();




    const query = `


WITH student_attendance AS (



SELECT



    sp.admission_number,


    sp.roll_number,


    sp.student_name,


    sp.profile_photo,



    sp.gender,


    sp.date_of_birth,


    sp.blood_group,



    sp.father_name,


    sp.father_mobile,


    sp.father_occupation,



    sp.mother_name,


    sp.mother_mobile,


    sp.mother_occupation,



    sp.email,


    sp.address,


    sp.city,


    sp.state,


    sp.pincode,



    sp.transport,


    sp.hostel,



    COUNT(ad.id) AS total_attendance,



    COUNT(

        CASE

            WHEN ad.status = 'Present'

            THEN 1

        END

    ) AS present_attendance





FROM "student_profiles" sp





JOIN classes c

ON c.class_name = sp.class_name





JOIN sections s

ON s.section_name = sp.section





LEFT JOIN "attendance_detail" ad

ON ad.admission_number = sp.admission_number





LEFT JOIN "attendance" a

ON a.id = ad.attendance_id


AND a.session_id = (

    SELECT id

    FROM "sessions"

    WHERE session_name = $1

    LIMIT 1

)



AND a.class_id = c.id


AND a.section_id = s.id





WHERE


sp.session = $1


AND c.id = $2


AND s.id = $3





GROUP BY



sp.admission_number,


sp.roll_number,


sp.student_name,


sp.profile_photo,



sp.gender,


sp.date_of_birth,


sp.blood_group,



sp.father_name,


sp.father_mobile,


sp.father_occupation,



sp.mother_name,


sp.mother_mobile,


sp.mother_occupation,



sp.email,


sp.address,


sp.city,


sp.state,


sp.pincode,



sp.transport,


sp.hostel




)



SELECT



admission_number,


roll_number,


student_name,


profile_photo,



gender,


date_of_birth,


blood_group,



father_name,


father_mobile,


father_occupation,



mother_name,


mother_mobile,


mother_occupation,



email,


address,


city,


state,


pincode,



transport,


hostel,




ROUND(

(

present_attendance::numeric

/

NULLIF(

total_attendance,

0

)

)

*

100

,2)

AS attendance_percentage,






ROUND(

AVG(

(

present_attendance::numeric

/

NULLIF(

total_attendance,

0

)

)

*

100

)

OVER()

,2)

AS class_attendance_percentage





FROM student_attendance





ORDER BY

roll_number ASC;



`;





    const { rows } = await pool.query(

        query,

        [

            sessionName,

            classId,

            sectionId

        ]

    );



    return rows;


};







export {


    getActiveSession,


    getTeacherAssignments,


    verifyTeacherAssignment,


    getStudents


};