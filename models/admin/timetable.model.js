import { getPool } from "../../config/postgressSupabaseDb.js";




// GET ALL TIMETABLE

export const getTimetable = async()=>{


const pool=getPool();


const result = await pool.query(

`
SELECT

t.id,

t.session_id,

s.session_name,

t.day_of_week,

t.teacher_number,

tp.teacher_name,

c.class_name,

sec.section_name,

sub.subject_name,

p.period_name


FROM "timetable" t


JOIN sessions s
ON s.id=t.session_id


JOIN classes c
ON c.id=t.class_id


JOIN sections sec
ON sec.id=t.section_id


JOIN subjects sub
ON sub.id=t.subject_id


JOIN teacher_profiles tp
ON tp.teacher_number=t.teacher_number


JOIN periods p
ON p.id=t.period_id


ORDER BY t.id DESC

`

);


return result.rows;


};









// CHECK TEACHER ASSIGNMENT

export const checkTeacherAssignment = async(data)=>{


const pool=getPool();


const result = await pool.query(

`
SELECT id

FROM "teacherAsignedClass"


WHERE

teacher_number=$1

AND class_id=$2

AND section_id=$3

AND subject_id=$4

AND session_id=$5

LIMIT 1

`,

[

data.teacher_number,

data.class_id,

data.section_id,

data.subject_id,

data.session_id

]

);


return result.rows[0];


};









// CREATE TIMETABLE


export const createTimetable = async(data)=>{


const pool=getPool();



const result = await pool.query(

`

INSERT INTO "timetable"

(

session_id,

class_id,

section_id,

subject_id,

teacher_number,

day_of_week,

period_id

)


VALUES

($1,$2,$3,$4,$5,$6,$7)


RETURNING *

`,

[

data.session_id,

data.class_id,

data.section_id,

data.subject_id,

data.teacher_number,

data.day_of_week,

data.period_id

]


);



return result.rows[0];


};









// DELETE TIMETABLE


export const deleteTimetable = async(id)=>{


const pool=getPool();


const result = await pool.query(

`

DELETE FROM "timetable"

WHERE id=$1

RETURNING *

`,

[id]

);



return result.rows[0];


};









// GET TEACHERS FOR CLASS SECTION


export const getTeachersByClassSection = async(
class_id,
section_id
)=>{


const pool=getPool();



const result = await pool.query(

`

SELECT DISTINCT


tac.teacher_number,


tp.teacher_name


FROM "teacherAsignedClass" tac


JOIN teacher_profiles tp

ON tp.teacher_number=tac.teacher_number



WHERE

tac.class_id=$1

AND

tac.section_id=$2



ORDER BY tp.teacher_name


`,

[

class_id,

section_id

]

);



return result.rows;


};









// GET SUBJECTS OF SELECTED TEACHER IN CLASS SECTION


export const getSubjectsByTeacher = async(
teacher_number,
class_id,
section_id,
session_id
)=>{


const pool=getPool();



const result = await pool.query(

`

SELECT


tac.subject_id,


sub.subject_name


FROM "teacherAsignedClass" tac


JOIN subjects sub

ON sub.id=tac.subject_id



WHERE

tac.teacher_number=$1

AND tac.class_id=$2

AND tac.section_id=$3

AND tac.session_id=$4


`,

[

teacher_number,

class_id,

section_id,

session_id

]


);



return result.rows;


};