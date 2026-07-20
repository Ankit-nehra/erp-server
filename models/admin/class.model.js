import { getPool } from "../../config/postgressSupabaseDb.js";


// Get All Classes
export const getAllClasses = async () => {

    const pool = getPool();

    const result = await pool.query(
        `
        SELECT *
        FROM "classes"
        ORDER BY id DESC;
        `
    );

    return result.rows;
};



// Create Class
export const createClass = async (className) => {

    const pool = getPool();

    const result = await pool.query(
        `
        INSERT INTO "classes"
        (
            class_name
        )
        VALUES
        (
            $1
        )
        RETURNING *;
        `,
        [
            className
        ]
    );

    return result.rows[0];
};



// Delete Class
export const deleteClass = async (id) => {

    const pool = getPool();

    const result = await pool.query(
        `
        DELETE FROM "classes"
        WHERE id = $1
        RETURNING *;
        `,
        [
            id
        ]
    );

    return result.rows[0];
};