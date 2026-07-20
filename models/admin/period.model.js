import { getPool } from "../../config/postgressSupabaseDb.js";

// Get All Periods
export const getAllPeriods = async () => {

    const pool = getPool();

    const result = await pool.query(`
        SELECT *
        FROM "periods"
        ORDER BY id DESC;
    `);

    return result.rows;
};


// Create Period
export const createPeriod = async (periodName) => {

    const pool = getPool();

    const result = await pool.query(
        `
        INSERT INTO "periods"
        (
            period_name
        )
        VALUES
        (
            $1
        )
        RETURNING *;
        `,
        [periodName]
    );

    return result.rows[0];
};


// Delete Period
export const deletePeriod = async (id) => {

    const pool = getPool();

    const result = await pool.query(
        `
        DELETE FROM "periods"
        WHERE id=$1
        RETURNING *;
        `,
        [id]
    );

    return result.rows[0];
};