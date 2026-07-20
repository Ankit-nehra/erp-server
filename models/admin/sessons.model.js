import { getPool } from "../../config/postgressSupabaseDb.js";

// Get All Sessions
export const getAllSessions = async () => {
    const pool = getPool();

    const result = await pool.query(`
        SELECT *
        FROM "sessions"
        ORDER BY start_date DESC;
    `);

    return result.rows;
};

// Get Session By ID
export const getSessionById = async (id) => {
    const pool = getPool();

    const result = await pool.query(
        `
        SELECT *
        FROM "sessions"
        WHERE id = $1;
        `,
        [id]
    );

    return result.rows[0];
};

// Create Session
export const createSession = async ({
    session_name,
    start_date,
    end_date,
    is_active,
}) => {
    const pool = getPool();

    const result = await pool.query(
        `
        INSERT INTO "sessions"
        (
            session_name,
            start_date,
            end_date,
            is_active
        )
        VALUES
        (
            $1,
            $2,
            $3,
            $4
        )
        RETURNING *;
        `,
        [
            session_name,
            start_date,
            end_date,
            is_active,
        ]
    );

    return result.rows[0];
};

// Delete Session
export const deleteSession = async (id) => {
    const pool = getPool();

    const result = await pool.query(
        `
        DELETE FROM "sessions"
        WHERE id = $1
        RETURNING *;
        `,
        [id]
    );

    return result.rows[0];
};