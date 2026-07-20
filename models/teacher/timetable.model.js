import { getPool } from "../../config/postgressSupabaseDb.js";

export const getTeacherTimetable = async (teacherNumber) => {

    const pool = getPool();

    const result = await pool.query(
        `
        SELECT

            t.id,
            t.day_of_week,
            t.period_id,

            p.period_name,

            c.class_name,
            sec.section_name,

            sub.subject_name,

            s.session_name

        FROM timetable t

        INNER JOIN sessions s
            ON s.id = t.session_id

        INNER JOIN classes c
            ON c.id = t.class_id

        INNER JOIN sections sec
            ON sec.id = t.section_id

        INNER JOIN subjects sub
            ON sub.id = t.subject_id

        INNER JOIN periods p
            ON p.id = t.period_id

        WHERE

            t.teacher_number = $1
            AND s.is_active = TRUE

        ORDER BY

            t.day_of_week ASC,
            t.period_id ASC
        `,
        [teacherNumber]
    );

    return result.rows;
};