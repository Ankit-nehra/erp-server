import { getPool } from "../../config/postgressSupabaseDb.js";





const getStudentNotices = async(
    admission_number
)=>{

const pool = getPool();

    const query = `

    SELECT

        n.id,

        n.title,

        n.description,

        n.created_at,


        c.class_name,

        s.section_name,


        se.session_name



    FROM Student_Profiles sp



    INNER JOIN classes c

    ON c.class_name = sp.class_name



    INNER JOIN sections s

    ON s.section_name = sp.section



    INNER JOIN sessions se

    ON se.session_name = sp.session



    INNER JOIN notices n

    ON n.class_id = c.id

    AND n.section_id = s.id

    AND n.session_id = se.id



    WHERE sp.admission_number = $1



    ORDER BY n.created_at DESC;


    `;



    const {rows} = await pool.query(

        query,

        [
            admission_number
        ]

    );


    return rows;


};



export default {

    getStudentNotices

};