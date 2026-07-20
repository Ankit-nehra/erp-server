import { getPool } from "../../config/postgressSupabaseDb.js";


// Get All Subjects
export const getAllSubjects = async () => {

    const pool = getPool();

    const result = await pool.query(
        `
        SELECT *
        FROM "subjects"
        ORDER BY id DESC;
        `
    );

    return result.rows;

};



// Create Subject
export const createSubject = async ({
    subject_name,
    subject_code
}) => {

    const pool = getPool();

    const result = await pool.query(
        `
        INSERT INTO "subjects"
        (
            subject_name,
            subject_code
        )
        VALUES
        (
            $1,
            $2
        )
        RETURNING *;
        `,
        [
            subject_name,
            subject_code
        ]
    );


    return result.rows[0];

};



// Delete Subject
export const deleteSubject = async (id) => {

    const pool = getPool();

    const result = await pool.query(
        `
        DELETE FROM "subjects"
        WHERE id = $1
        RETURNING *;
        `,
        [
            id
        ]
    );


    return result.rows[0];

};