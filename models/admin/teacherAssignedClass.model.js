import { getPool } from "../../config/postgressSupabaseDb.js";


// Get All Assigned Classes
export const getAllTeacherAssignedClasses = async () => {

    const pool = getPool();


    const result = await pool.query(
        `
        SELECT

            tac.id,

            tac.teacher_number,

            t.teacher_name,

            c.class_name,

            s.section_name,

            sub.subject_name,

            ss.session_name


        FROM "teacherAsignedClass" tac


        LEFT JOIN "teacher_profiles" t
        ON tac.teacher_number = t.teacher_number


        LEFT JOIN "classes" c
        ON tac.class_id = c.id


        LEFT JOIN "sections" s
        ON tac.section_id = s.id


        LEFT JOIN "subjects" sub
        ON tac.subject_id = sub.id


        LEFT JOIN "sessions" ss
        ON tac.session_id = ss.id


        ORDER BY tac.id DESC;

        `
    );


    return result.rows;

};







// Create Teacher Assignment
export const createTeacherAssignedClass = async ({
    teacher_number,
    class_id,
    section_id,
    subject_id,
    session_id
}) => {


    const pool = getPool();


    const result = await pool.query(

        `
        INSERT INTO "teacherAsignedClass"
        (
            teacher_number,
            class_id,
            section_id,
            subject_id,
            session_id
        )

        VALUES
        (
            $1,
            $2,
            $3,
            $4,
            $5
        )

        RETURNING *;

        `,

        [
            teacher_number,
            class_id,
            section_id,
            subject_id,
            session_id
        ]

    );


    return result.rows[0];

};







// Delete Assignment
export const deleteTeacherAssignedClass = async (id)=>{


    const pool = getPool();


    const result = await pool.query(

        `
        DELETE FROM "teacherAsignedClass"

        WHERE id=$1

        RETURNING *;

        `,

        [
            id
        ]

    );


    return result.rows[0];


};