import { getPool } from "../../config/postgressSupabaseDb.js";


export const findPrincipalProfileByNumber = async (principalNumber) => {

    const pool = getPool();


    const result = await pool.query(
        `
        SELECT *
        FROM "principal_profiles"
        WHERE principal_number = $1
        `,
        [principalNumber]
    );


    return result.rows[0];

};