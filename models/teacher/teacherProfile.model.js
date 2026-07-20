import { getPool } from "../../config/postgressSupabaseDb.js";



/*
|--------------------------------------------------------------------------
| Find Teacher Profile
|--------------------------------------------------------------------------
*/

export const findTeacherProfileByNumber = async (
    teacherNumber
) => {


    const pool = getPool();


    const result = await pool.query(
        `
        SELECT

            id,
            teacher_name,
            teacher_number,
            designation,
            qualification,
            profile_photo

        FROM "teacher_profiles"

        WHERE teacher_number = $1

        LIMIT 1

        `,
        [
            teacherNumber
        ]
    );


    return result.rows[0];


};









/*
|--------------------------------------------------------------------------
| Get Teacher Dashboard Stats
|--------------------------------------------------------------------------
|
| Returns:
|
| Total Students
| Total Subjects
| Today's Attendance
|
|--------------------------------------------------------------------------
*/


export const getTeacherDashboardStats = async (
    teacherNumber
)=>{


    const pool = getPool();



    const query = `


    WITH teacher_assignment AS (

        SELECT DISTINCT

            class_id,
            section_id,
            subject_id,
            session_id


        FROM "teacherAsignedClass"


        WHERE teacher_number = $1

    )



    SELECT



    (

        SELECT COUNT(*)

        FROM "student_profiles" sp


        JOIN classes c

        ON c.class_name = sp.class_name



        JOIN sections s

        ON s.section_name = sp.section



        WHERE EXISTS (

            SELECT 1

            FROM teacher_assignment ta


            WHERE

            ta.class_id = c.id

            AND

            ta.section_id = s.id


        )

    ) AS total_students,





    (

        SELECT COUNT(DISTINCT subject_id)

        FROM teacher_assignment


    ) AS total_subjects



    `;



    const result =
    await pool.query(
        query,
        [
            teacherNumber
        ]
    );



    const row =
    result.rows[0];



    return {

        total_students:
        Number(row.total_students),


        total_subjects:
        Number(row.total_subjects),


        today_attendance:
        await getTodayAttendancePercentage(
            teacherNumber
        ),


        pending_marks:3

    };


};









/*
|--------------------------------------------------------------------------
| Today's Attendance Percentage
|--------------------------------------------------------------------------
*/


export const getTodayAttendancePercentage = async (
    teacherNumber
)=>{


    const pool=getPool();



    const result =
    await pool.query(

        `

        SELECT


        ROUND(

            (

            COUNT(
                CASE
                WHEN ad.status='Present'
                THEN 1
                END

            )::numeric


            /

            NULLIF(
                COUNT(ad.id),
                0
            )


            )

            *

            100

        ,2)


        AS percentage



        FROM "attendance" a



        JOIN "attendance_detail" ad

        ON ad.attendance_id=a.id



        WHERE


        a.teacher_number=$1


        AND


        a.attendance_date=CURRENT_DATE


        `,

        [
            teacherNumber
        ]

    );



    return result.rows[0]?.percentage
    ?
    `${result.rows[0].percentage}%`
    :
    "0%";

};









/*
|--------------------------------------------------------------------------
| Get Assigned Classes
|--------------------------------------------------------------------------
*/


export const getTeacherAssignedClasses =
async(
    teacherNumber
)=>{


    const pool=getPool();



    const result =
    await pool.query(

        `

        SELECT


        c.class_name,

        s.section_name,

        sub.subject_name,

        sub.subject_code



        FROM "teacherAsignedClass" tac



        JOIN classes c

        ON c.id=tac.class_id



        JOIN sections s

        ON s.id=tac.section_id



        JOIN subjects sub

        ON sub.id=tac.subject_id



        WHERE

        tac.teacher_number=$1



        ORDER BY

        c.class_name,

        s.section_name


        `,

        [
            teacherNumber
        ]

    );



    return result.rows;


};