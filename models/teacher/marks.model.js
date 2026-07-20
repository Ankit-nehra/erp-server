// models/teacher/marks.model.js


import { getPool } from "../../config/postgressSupabaseDb.js";





/*
|--------------------------------------------------------------------------
| Get Active Session
|--------------------------------------------------------------------------
*/

const getActiveSession = async () => {


    const pool = getPool();


    const query = `

        SELECT

            id,

            session_name


        FROM "sessions"


        WHERE is_active = true


        LIMIT 1;

    `;



    const { rows } = await pool.query(query);



    return rows[0];


};









/*
|--------------------------------------------------------------------------
| Get Teacher Assigned Classes
|--------------------------------------------------------------------------
*/


const getTeacherAssignments = async (

    teacherNumber,

    sessionId

) => {



    const pool = getPool();



    const query = `


        SELECT


            tac.class_id,

            c.class_name,


            tac.section_id,

            s.section_name,


            tac.subject_id,

            sub.subject_name,

            sub.subject_code



        FROM "teacherAsignedClass" tac



        JOIN classes c

        ON c.id = tac.class_id



        JOIN sections s

        ON s.id = tac.section_id



        JOIN subjects sub

        ON sub.id = tac.subject_id



        WHERE


            tac.teacher_number = $1


            AND tac.session_id = $2



        ORDER BY


            c.class_name,

            s.section_name;



    `;



    const { rows } = await pool.query(

        query,

        [

            teacherNumber,

            sessionId

        ]

    );



    return rows;



};









/*
|--------------------------------------------------------------------------
| Verify Teacher Assignment
|--------------------------------------------------------------------------
*/


const verifyTeacherAssignment = async ({

    teacherNumber,

    sessionId,

    classId,

    sectionId,

    subjectId


}) => {



    const pool = getPool();



    const query = `


        SELECT id


        FROM "teacherAsignedClass"


        WHERE


            teacher_number = $1


            AND session_id = $2


            AND class_id = $3


            AND section_id = $4


            AND subject_id = $5



        LIMIT 1;


    `;



    const { rows } = await pool.query(

        query,

        [

            teacherNumber,

            sessionId,

            classId,

            sectionId,

            subjectId

        ]

    );



    return rows.length > 0;



};









/*
|--------------------------------------------------------------------------
| Get Exam Types
|--------------------------------------------------------------------------
*/


const getExamTypes = async () => {



    const pool = getPool();



    const query = `


        SELECT


            id,

            exam_name,

            display_order



        FROM "exam_types"



        WHERE is_active = true



        ORDER BY display_order ASC;



    `;



    const { rows } = await pool.query(query);



    return rows;



};









/*
|--------------------------------------------------------------------------
| Get Students
|--------------------------------------------------------------------------
*/


const getStudents = async ({

    sessionName,

    classId,

    sectionId


}) => {



    const pool = getPool();




    const query = `


        SELECT


            sp.admission_number,


            sp.student_name,


            sp.roll_number,


            sp.profile_photo



        FROM "student_profiles" sp



        JOIN classes c

        ON c.id = $2



        JOIN sections s

        ON s.id = $3




        WHERE


            sp.session = $1


            AND sp.class_name = c.class_name


            AND sp.section = s.section_name



        ORDER BY


            sp.roll_number ASC;



    `;




    const { rows } = await pool.query(

        query,

        [

            sessionName,

            classId,

            sectionId

        ]

    );



    return rows;



};









/*
|--------------------------------------------------------------------------
| Check Existing Marks
|--------------------------------------------------------------------------
*/


const getMarks = async ({

    sessionId,

    classId,

    sectionId,

    subjectId,

    examTypeId,

 
    examDate


}) => {



    const pool = getPool();



    const query = `


        SELECT *


        FROM "marks"



        WHERE


            session_id = $1


            AND class_id = $2


            AND section_id = $3


            AND subject_id = $4


            AND exam_type_id = $5


  


            AND exam_date = $6



        LIMIT 1;



    `;




    const { rows } = await pool.query(

        query,

        [

            sessionId,

            classId,

            sectionId,

            subjectId,

            examTypeId,

           

            examDate

        ]

    );



    return rows[0];



};









/*
|--------------------------------------------------------------------------
| Get Marks Details
|--------------------------------------------------------------------------
*/


const getMarksDetails = async (marksId) => {



    const pool = getPool();




    const query = `


        SELECT


            sp.admission_number,


            sp.student_name,


            sp.roll_number,


            sp.profile_photo,


            md.obtained_marks,


            md.remarks



        FROM "marks_detail" md



        JOIN student_profiles sp


        ON sp.admission_number = md.admission_number



        WHERE


            md.marks_id = $1



        ORDER BY


            sp.roll_number ASC;



    `;




    const { rows } = await pool.query(

        query,

        [

            marksId

        ]

    );



    return rows;



};










/*
|--------------------------------------------------------------------------
| Create Marks Record
|--------------------------------------------------------------------------
|
| Insert main marks entry
|
| One row = One exam/test
|
|--------------------------------------------------------------------------
*/


const createMarksRecord = async (

    client,

    {

        sessionId,

        classId,

        sectionId,

        subjectId,

        examTypeId,

        teacherNumber,

        

        examDate,

        maximumMarks,

        passingMarks


    }

) => {



    const query = `


        INSERT INTO "marks"

        (

            session_id,

            class_id,

            section_id,

            subject_id,

            exam_type_id,

            teacher_number,        

            exam_date,

            maximum_marks,

            passing_marks


        )


        VALUES

        (

            $1,

            $2,

            $3,

            $4,

            $5,

            $6,

            $7,

            $8,

            $9

        )


        RETURNING *;



    `;



    const { rows } = await client.query(

        query,

        [

            sessionId,

            classId,

            sectionId,

            subjectId,

            examTypeId,

            teacherNumber,

            examDate,

            maximumMarks,

            passingMarks

        ]

    );



    return rows[0];


};









/*
|--------------------------------------------------------------------------
| Create Marks Details
|--------------------------------------------------------------------------
|
| Bulk insert student marks
|
|--------------------------------------------------------------------------
*/


const createMarksDetails = async (

    client,

    marksId,

    students,

    maximumMarks


) => {



    const values = [];

    const placeholders = [];




    students.forEach(

        (student,index)=>{


            /*
            Each row has 3 values:

            marks_id
            admission_number
            obtained_marks
            remarks

            */

            const p = index * 4;



            placeholders.push(

                `

                ($${p+1},

                 $${p+2},

                 $${p+3},

                 $${p+4})

                `

            );




            let obtainedMarks =

            Number(
                student.marks || 0
            );




            /*
            Validation

            Marks cannot exceed maximum marks

            */


            if(

                obtainedMarks < 0 ||

                obtainedMarks > maximumMarks

            ){

                throw new Error(

                    `Invalid marks entered for ${student.admission_number}`

                );

            }




            values.push(


                marksId,


                student.admission_number,


                obtainedMarks,


                student.remarks || null


            );



        }

    );






    const query = `


        INSERT INTO "marks_detail"


        (

            marks_id,

            admission_number,

            obtained_marks,

            remarks


        )


        VALUES


        ${placeholders.join(",")}



    `;




    await client.query(

        query,

        values

    );



};









/*
|--------------------------------------------------------------------------
| Delete Marks Record
|--------------------------------------------------------------------------
|
| Teacher can delete own uploaded marks only
|
| marks_detail deleted automatically
| because ON DELETE CASCADE
|
|--------------------------------------------------------------------------
*/


const deleteMarksRecord = async (

    marksId,

    teacherNumber


)=>{


    const pool = getPool();




    const query = `


        DELETE FROM "marks"



        WHERE


            id = $1



            AND teacher_number = $2



        RETURNING id;



    `;




    const { rows } = await pool.query(

        query,

        [

            marksId,

            teacherNumber

        ]

    );



    return rows[0];



};








/*
|--------------------------------------------------------------------------
| Final Export
|--------------------------------------------------------------------------
*/


export {


    getActiveSession,


    getTeacherAssignments, 


    verifyTeacherAssignment,


    getExamTypes,


    getStudents,


    getMarks,


    getMarksDetails,


    createMarksRecord,


    createMarksDetails,


    deleteMarksRecord


};