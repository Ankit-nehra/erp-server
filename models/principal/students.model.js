import { getPool } from "../../config/postgressSupabaseDb.js";

/*
|--------------------------------------------------------------------------
| Get Sessions
|--------------------------------------------------------------------------
*/

const getSessions = async () => {

    const pool = getPool();

    const query = `

        SELECT

            id,

            session_name,

            is_active

        FROM sessions

        ORDER BY start_date DESC;

    `;

    const { rows } = await pool.query(query);

    return rows;

};



/*
|--------------------------------------------------------------------------
| Get Classes
|--------------------------------------------------------------------------
*/

const getClasses = async () => {

    const pool = getPool();

    const query = `

        SELECT

            id,

            class_name

        FROM classes

        ORDER BY class_name;

    `;

    const { rows } = await pool.query(query);

    return rows;

};



/*
|--------------------------------------------------------------------------
| Get Sections
|--------------------------------------------------------------------------
*/
const getSections = async () => {

    const pool = getPool();

    const query = `

        SELECT

            id,

            section_name

        FROM sections

        ORDER BY section_name;

    `;


    const { rows } = await pool.query(query);

    return rows;

};



/*
|--------------------------------------------------------------------------
| Student Page Options
|--------------------------------------------------------------------------
*/

const getStudentOptions = async () => {

    const [

        sessions,

        classes,

        sections

    ] = await Promise.all([

        getSessions(),

        getClasses(),

        getSections()

    ]);



    return {

        sessions,

        classes,

        sections

    };

};





/*
|--------------------------------------------------------------------------
| Get Students List
|--------------------------------------------------------------------------
*/

const getStudentsList = async ({

    sessionId,

    classId,

    sectionId

}) => {

    const pool = getPool();

    const query = `

WITH session_data AS (

    SELECT

        id,

        session_name

    FROM sessions

    WHERE id = $1

),

attendance_summary AS (

    SELECT

        ad.admission_number,

        ROUND(

            (
                COUNT(
                    CASE
                        WHEN ad.status = 'Present'
                        THEN 1
                    END
                )::numeric

                /

                NULLIF(COUNT(ad.id),0)

            ) * 100,

            2

        ) AS attendance_percentage

    FROM attendance_detail ad

    JOIN attendance a

        ON a.id = ad.attendance_id

    WHERE

        a.session_id = $1

        AND a.class_id = $2

        AND a.section_id = $3

    GROUP BY

        ad.admission_number

),

performance_summary AS (

    SELECT

        md.admission_number,

        ROUND(

            (

                SUM(md.obtained_marks)

                /

                NULLIF(

                    SUM(m.maximum_marks),

                    0

                )

            ) * 100,

            2

        ) AS performance_percentage

    FROM marks_detail md

    JOIN marks m

        ON m.id = md.marks_id

    WHERE

        m.session_id = $1

        AND m.class_id = $2

        AND m.section_id = $3

    GROUP BY

        md.admission_number

)

SELECT

    sp.admission_number,

    sp.roll_number,

    sp.student_name,

    sp.profile_photo,

    sp.gender,

    c.class_name,

    s.section_name,

    COALESCE(

        attendance_summary.attendance_percentage,

        0

    ) AS attendance_percentage,

    COALESCE(

        performance_summary.performance_percentage,

        0

    ) AS performance_percentage

FROM student_profiles sp

JOIN session_data sd

    ON sd.session_name = sp.session

JOIN classes c

    ON c.class_name = sp.class_name

JOIN sections s

    ON s.section_name = sp.section

LEFT JOIN attendance_summary

    ON attendance_summary.admission_number =
       sp.admission_number

LEFT JOIN performance_summary

    ON performance_summary.admission_number =
       sp.admission_number

WHERE

    c.id = $2

    AND s.id = $3

ORDER BY

    sp.roll_number ASC;

    `;

    const { rows } = await pool.query(

        query,

        [

            sessionId,

            classId,

            sectionId

        ]

    );

    return rows;

};



export {

    getStudentOptions,

    getStudentsList

};