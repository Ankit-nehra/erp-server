import { getPool } from "../../config/postgressSupabaseDb.js";



/*
|--------------------------------------------------------------------------
| Get Active Session
|--------------------------------------------------------------------------
*/


const getActiveSession = async()=>{


const pool = getPool();



const query = `

SELECT

id,

session_name

FROM "sessions"

WHERE is_active = true

LIMIT 1;

`;



const {rows} = await pool.query(query);



return rows[0];


};










/*
|--------------------------------------------------------------------------
| Get Classes
|--------------------------------------------------------------------------
*/


const getClasses = async()=>{


const pool = getPool();



const query = `

SELECT

id,

class_name

FROM classes

ORDER BY class_name ASC;

`;



const {rows}=await pool.query(query);



return rows;


};










/*
|--------------------------------------------------------------------------
| Get Sections
|--------------------------------------------------------------------------
*/


const getSections = async()=>{


const pool = getPool();



const query = `


SELECT

id,

section_name

FROM sections

ORDER BY section_name ASC;


`;



const {rows}=await pool.query(query);



return rows;


};











/*
|--------------------------------------------------------------------------
| Create Student Login
|--------------------------------------------------------------------------
*/


const createStudentLogin = async({


admissionNumber,


password



})=>{


const pool=getPool();



const query = `


INSERT INTO "studentsLogin"

(

admission_number,

password

)


VALUES

(

$1,

$2

)


RETURNING *;


`;



const {rows}=await pool.query(

query,

[

admissionNumber,

password

]

);



return rows[0];


};









/*
|--------------------------------------------------------------------------
| Create Student Profile
|--------------------------------------------------------------------------
*/


const createStudentProfile = async(data)=>{


const pool=getPool();



const query = `


INSERT INTO "student_profiles"

(

admission_number,

student_name,

roll_number,

class_name,

section,

session,

profile_photo,

gender,

date_of_birth,

blood_group,

father_name,

father_mobile,

father_occupation,

mother_name,

mother_mobile,

mother_occupation,

email,

address,

city,

state,

pincode,

aadhar_number,

transport,

hostel


)


VALUES


(

$1,$2,$3,$4,$5,$6,$7,

$8,$9,$10,$11,$12,$13,

$14,$15,$16,$17,$18,

$19,$20,$21,$22,$23,$24

)



RETURNING *;


`;




const values=[


data.admission_number,

data.student_name,

data.roll_number,

data.class_name,

data.section,

data.session,

data.profile_photo,


data.gender,

data.date_of_birth,

data.blood_group,


data.father_name,

data.father_mobile,

data.father_occupation,


data.mother_name,

data.mother_mobile,

data.mother_occupation,


data.email,

data.address,

data.city,

data.state,

data.pincode,


data.aadhar_number,


data.transport,

data.hostel


];




const {rows}=await pool.query(

query,

values

);



return rows[0];


};









/*
|--------------------------------------------------------------------------
| Get All Students
|--------------------------------------------------------------------------
*/


const getAllStudents = async()=>{


const pool=getPool();



const query=`


SELECT


sp.*,


c.id AS class_id,


c.class_name,


s.id AS section_id,


s.section_name



FROM "student_profiles" sp



LEFT JOIN classes c

ON c.class_name = sp.class_name



LEFT JOIN sections s

ON s.section_name = sp.section



ORDER BY sp.roll_number ASC;



`;



const {rows}=await pool.query(query);



return rows;


};









/*
|--------------------------------------------------------------------------
| Get Single Student
|--------------------------------------------------------------------------
*/


const getStudentById = async(id)=>{


const pool=getPool();



const query=`


SELECT

sp.*,


c.class_name,


s.section_name



FROM "student_profiles" sp



LEFT JOIN classes c

ON c.class_name = sp.class_name



LEFT JOIN sections s

ON s.section_name = sp.section



WHERE sp.id=$1;



`;



const {rows}=await pool.query(

query,

[id]

);



return rows[0];


};









/*
|--------------------------------------------------------------------------
| Update Student
|--------------------------------------------------------------------------
*/


const updateStudent = async(id,data)=>{


const pool=getPool();



const query=`


UPDATE "student_profiles"


SET


student_name=$1,

roll_number=$2,

class_name=$3,

section=$4,

profile_photo=$5,

gender=$6,

date_of_birth=$7,

blood_group=$8,

father_name=$9,

father_mobile=$10,

father_occupation=$11,

mother_name=$12,

mother_mobile=$13,

mother_occupation=$14,

email=$15,

address=$16,

city=$17,

state=$18,

pincode=$19,

aadhar_number=$20,

transport=$21,

hostel=$22



WHERE id=$23



RETURNING *;


`;




const values=[


data.student_name,

data.roll_number,

data.class_name,

data.section,

data.profile_photo,


data.gender,

data.date_of_birth,

data.blood_group,


data.father_name,

data.father_mobile,

data.father_occupation,


data.mother_name,

data.mother_mobile,

data.mother_occupation,


data.email,

data.address,

data.city,

data.state,

data.pincode,


data.aadhar_number,


data.transport,

data.hostel,


id


];




const {rows}=await pool.query(

query,

values

);



return rows[0];


};











/*
|--------------------------------------------------------------------------
| Delete Student
|--------------------------------------------------------------------------
*/


const deleteStudent = async(id)=>{


const pool=getPool();



const client = await pool.connect();



try{


await client.query("BEGIN");



const student = await client.query(

`

SELECT admission_number

FROM "student_profiles"

WHERE id=$1;

`,

[id]

);



const admissionNumber =

student.rows[0]?.admission_number;





await client.query(

`

DELETE FROM "student_profiles"

WHERE id=$1;

`,

[id]

);





await client.query(

`

DELETE FROM "studentsLogin"

WHERE admission_number=$1;

`,

[admissionNumber]

);





await client.query("COMMIT");



return true;



}

catch(error){


await client.query("ROLLBACK");

throw error;


}

finally{


client.release();


}


};









export {


getActiveSession,

getClasses,

getSections,

createStudentLogin,

createStudentProfile,

getAllStudents,

getStudentById,

updateStudent,

deleteStudent


};  