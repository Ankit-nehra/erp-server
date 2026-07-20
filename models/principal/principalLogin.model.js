import { getPool } from "../../config/postgressSupabaseDb.js";


export const findPrincipalByNumber = async (principalNumber) => {

    const pool = getPool();


    const result = await pool.query(
        `
        SELECT *
        FROM "principalsLogin"
        WHERE principal_number = $1
        `,
        [principalNumber]
    );


    return result.rows[0];

};