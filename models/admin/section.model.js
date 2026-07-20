import { getPool } from "../../config/postgressSupabaseDb.js";


// Get All Sections
export const getAllSections = async () => {

    const pool = getPool();

    const result = await pool.query(
        `
        SELECT *
        FROM "sections"
        ORDER BY id DESC;
        `
    );

    return result.rows;

};



// Create Section
export const createSection = async (sectionName) => {

    const pool = getPool();

    const result = await pool.query(
        `
        INSERT INTO "sections"
        (
            section_name
        )
        VALUES
        (
            $1
        )
        RETURNING *;
        `,
        [
            sectionName
        ]
    );

    return result.rows[0];

};



// Delete Section
export const deleteSection = async (id) => {

    const pool = getPool();

    const result = await pool.query(
        `
        DELETE FROM "sections"
        WHERE id = $1
        RETURNING *;
        `,
        [
            id
        ]
    );

    return result.rows[0];

};