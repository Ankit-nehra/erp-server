import { getPool } from "../../config/postgressSupabaseDb.js";


export const getStudentTimetable = async(admissionNumber)=>{

    

const pool=getPool();


const result = await pool.query(

`

SELECT

t.id,

t.day_of_week,

t.period_id,

p.period_name,

sub.subject_name,

tp.teacher_name,

c.class_name,

sec.section_name,

s.session_name


FROM "student_profiles" sp


JOIN classes c

ON c.class_name = sp.class_name



JOIN sections sec

ON sec.section_name = sp.section



JOIN sessions s

ON s.session_name = sp.session



JOIN timetable t

ON t.class_id = c.id

AND t.section_id = sec.id

AND t.session_id = s.id



JOIN subjects sub

ON sub.id=t.subject_id



JOIN teacher_profiles tp

ON tp.teacher_number=t.teacher_number



JOIN periods p

ON p.id=t.period_id



WHERE

sp.admission_number=$1



ORDER BY

t.day_of_week,

p.id


`,

[
admissionNumber
]


);


return result.rows;


};