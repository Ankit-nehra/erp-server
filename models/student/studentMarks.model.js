import { getPool } from "../../config/postgressSupabaseDb.js";



const getStudentMarks = async (admissionNumber) => {


    const pool = getPool();



    const query = `

    SELECT


        m.id as marks_id,

        et.exam_name,

        sub.subject_name,

        sub.subject_code,

        m.maximum_marks,

        m.exam_date,


        md.obtained_marks,

        md.remarks



    FROM "marks_detail" md



    JOIN "marks" m

    ON m.id = md.marks_id



    JOIN subjects sub

    ON sub.id = m.subject_id



    JOIN exam_types et

    ON et.id = m.exam_type_id



    WHERE

        md.admission_number = $1



    ORDER BY

        m.exam_date DESC,

        sub.subject_name ASC


    `;



    const {rows} = await pool.query(
        query,
        [
            admissionNumber
        ]
    );


    return rows;


};





export {

    getStudentMarks

};