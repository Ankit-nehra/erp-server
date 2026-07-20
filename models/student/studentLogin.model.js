import { getPool } from "../../config/postgressSupabaseDb.js";


export const findStudentByAdmissionNumber = async (admissionNumber) => {

    const pool = getPool();

    const result = await pool.query(
        `
        SELECT *
        FROM "studentsLogin"
        WHERE admission_number = $1
        `,
        [admissionNumber]
    );


    return result.rows[0];

};