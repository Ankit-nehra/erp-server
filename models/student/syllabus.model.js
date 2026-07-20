import { getPool } from "../../config/postgressSupabaseDb.js";


export const getStudentSyllabusModel = async(
    admissionNumber
)=>{


const pool = getPool();



const query = `

SELECT

    sy.id,

    c.class_name,

    sec.section_name,

    sub.subject_name,

    ses.session_name,


    sy.chapter_title,

    sy.description,

    sy.completion_date,

    sy.status,

    sy.display_order,

    sy.created_at



FROM "student_profiles" sp



INNER JOIN classes c

ON LOWER(TRIM(sp.class_name)) =
   LOWER(TRIM(c.class_name))



INNER JOIN sections sec

ON LOWER(TRIM(sp.section)) =
   LOWER(TRIM(sec.section_name))



INNER JOIN sessions ses

ON LOWER(TRIM(sp.session)) =
   LOWER(TRIM(ses.session_name))



INNER JOIN syllabus sy

ON sy.class_id = c.id

AND sy.section_id = sec.id

AND sy.session_id = ses.id



INNER JOIN subjects sub

ON sy.subject_id = sub.id



WHERE sp.admission_number=$1



ORDER BY

sub.subject_name,

sy.display_order;


`;



const {rows}=await pool.query(

query,

[
admissionNumber
]

);


return rows;


};