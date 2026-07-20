import { getPool } from "../../config/postgressSupabaseDb.js";








/**
 * Check teacher assigned class & section
 */
const checkTeacherClassAssignment = async ({
    teacher_number,
    session_id,
    class_id,
    section_id,
}) => {

const pool = getPool();
    const query = `

        SELECT id

        FROM "teacherAsignedClass"

        WHERE teacher_number = $1

        AND session_id = $2

        AND class_id = $3

        AND section_id = $4

        LIMIT 1;

    `;



    const values = [

        teacher_number,

        session_id,

        class_id,

        section_id

    ];



    const { rows } = await pool.query(
        query,
        values
    );


    return rows.length > 0;


};









/**
 * Create Notice
 */
const createNotice = async ({

    session_id,

    class_id,

    section_id,

    teacher_number,

    title,

    description,

}) => {
const pool = getPool();

    const query = `

        INSERT INTO notices

        (
            session_id,
            class_id,
            section_id,
            teacher_number,
            title,
            description
        )


        VALUES

        (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6
        )


        RETURNING *;

    `;



    const values = [

        session_id,

        class_id,

        section_id,

        teacher_number,

        title,

        description

    ];



    const { rows } = await pool.query(
        query,
        values
    );


    return rows[0];


};









/**
 * Get teacher notices
 */
const getTeacherNotices = async (
    teacher_number
) => {
const pool = getPool();

    const query = `

        SELECT

            n.id,

            n.title,

            n.description,

            n.created_at,


            c.class_name,

            s.section_name


        FROM notices n



        INNER JOIN classes c

        ON c.id = n.class_id



        INNER JOIN sections s

        ON s.id = n.section_id



        WHERE n.teacher_number = $1



        ORDER BY n.created_at DESC;


    `;



    const { rows } = await pool.query(

        query,

        [
            teacher_number
        ]

    );


    return rows;


};









/**
 * Delete Notice
 */
const deleteNotice = async ({

    notice_id,

    teacher_number,

}) => {
const pool = getPool();


    const query = `

        DELETE FROM notices


        WHERE id = $1

        AND teacher_number = $2



        RETURNING *;


    `;



    const values = [

        notice_id,

        teacher_number

    ];



    const { rows } = await pool.query(

        query,

        values

    );



    return rows[0];


};









/**
 * Get teacher assigned classes
 */
const getTeacherAssignedClasses = async (

    teacher_number

)=>{
const pool = getPool();

    const query = `


        SELECT


            tac.class_id,

            c.class_name,


            tac.section_id,

            s.section_name



        FROM "teacherAsignedClass" tac



        INNER JOIN classes c

        ON c.id = tac.class_id



        INNER JOIN sections s

        ON s.id = tac.section_id



        WHERE tac.teacher_number = $1



        ORDER BY

        tac.class_id,

        tac.section_id;


    `;



    const { rows } = await pool.query(

        query,

        [
            teacher_number
        ]

    );



    return rows;


};








export default {


    checkTeacherClassAssignment,

    createNotice,

    getTeacherNotices,

    deleteNotice,

    getTeacherAssignedClasses,


};