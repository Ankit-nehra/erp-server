import { getPool } from "../../config/postgressSupabaseDb.js";


export const findTeacherByNumber = async (teacherNumber) => {

    const pool = getPool();


    const result = await pool.query(
        `
        SELECT *
        FROM "teachersLogin"
        WHERE teacher_number = $1
        `,
        [teacherNumber]
    );


    return result.rows[0];

};

// Get All Teachers
export const getAllTeachers = async () => {

    const pool = getPool();


    const result = await pool.query(
        `
        SELECT 
            tac.teacher_number,
            t.teacher_name
        FROM "teachersLogin" tac
         LEFT JOIN "teacher_profiles" t
        ON tac.teacher_number = t.teacher_number
        ORDER BY teacher_number ASC;
        `
    );


    return result.rows;

};