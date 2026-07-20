import { getPool } from "../../config/postgressSupabaseDb.js";


export const findStudentProfileByAdmissionNumber = async (admissionNumber) => {

    const pool = getPool();


    const result = await pool.query(
        `
        SELECT *
        FROM "student_profiles"
        WHERE admission_number = $1
        `,
        [admissionNumber]
    );


    return result.rows[0];

};