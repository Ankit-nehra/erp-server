import { getPool } from "../../config/postgressSupabaseDb.js";



/* ===========================================================
   GET ASSIGNED CLASS / SECTION / SUBJECT / SESSION
=========================================================== */

export const getAssignedOptionsModel = async (teacherNumber) => {
const pool = getPool();
    const query = `
        SELECT
            tac.id,

            c.id AS class_id,
            c.class_name,

            sec.id AS section_id,
            sec.section_name,

            sub.id AS subject_id,
            sub.subject_name,

            ses.id AS session_id,
            ses.session_name

        FROM "teacherAsignedClass" tac

        INNER JOIN classes c
            ON tac.class_id = c.id

        INNER JOIN sections sec
            ON tac.section_id = sec.id

        INNER JOIN subjects sub
            ON tac.subject_id = sub.id

        INNER JOIN sessions ses
            ON tac.session_id = ses.id

        WHERE tac.teacher_number=$1

        ORDER BY
            ses.session_name DESC,
            c.class_name,
            sec.section_name,
            sub.subject_name;
    `;

    const { rows } = await pool.query(query, [teacherNumber]);

    return rows;
};


/* ===========================================================
   CREATE SYLLABUS
=========================================================== */

export const createSyllabusModel = async (data) => {
const pool = getPool();
    const {

        teacherNumber,
        session_id,
        class_id,
        section_id,
        subject_id,
        chapter_title,
        description,
        completion_date,
        status

    } = data;

    /* display_order */

    const orderQuery = `
        SELECT
        COALESCE(MAX(display_order),0)+1 AS next_order

        FROM "syllabus"

        WHERE
            session_id=$1
        AND class_id=$2
        AND section_id=$3
        AND subject_id=$4;
    `;

    const orderResult = await pool.query(orderQuery, [

        session_id,
        class_id,
        section_id,
        subject_id

    ]);

    const displayOrder = orderResult.rows[0].next_order;

    const insertQuery = `
        INSERT INTO "syllabus"
        (

            session_id,
            class_id,
            section_id,
            subject_id,
            teacher_number,

            chapter_title,
            description,
            completion_date,
            status,
            display_order

        )

        VALUES
        (
            $1,$2,$3,$4,$5,
            $6,$7,$8,$9,$10
        )

        RETURNING *;
    `;

    const { rows } = await pool.query(insertQuery, [

        session_id,
        class_id,
        section_id,
        subject_id,
        teacherNumber,

        chapter_title,
        description,
        completion_date,
        status,
        displayOrder

    ]);

    return rows[0];

};



/* ===========================================================
   GET ALL SYLLABUS OF TEACHER
=========================================================== */

export const getTeacherSyllabusModel = async (teacherNumber) => {
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

    FROM "syllabus" sy

    INNER JOIN classes c
        ON sy.class_id=c.id

    INNER JOIN sections sec
        ON sy.section_id=sec.id

    INNER JOIN subjects sub
        ON sy.subject_id=sub.id

    INNER JOIN sessions ses
        ON sy.session_id=ses.id

    WHERE sy.teacher_number=$1

    ORDER BY

        ses.session_name DESC,
        c.class_name,
        sec.section_name,
        sub.subject_name,
        sy.display_order;

    `;

    const { rows } = await pool.query(query,[teacherNumber]);

    return rows;

};



/* ===========================================================
   UPDATE STATUS ONLY
=========================================================== */

export const updateSyllabusStatusModel = async (

    syllabusId,
    teacherNumber,
    status

)=>{
const pool = getPool();
    const query=`

        UPDATE "syllabus"

        SET

            status=$1,
            updated_at=NOW()

        WHERE

            id=$2

        AND teacher_number=$3

        RETURNING *;

    `;

    const {rows}=await pool.query(query,[

        status,
        syllabusId,
        teacherNumber

    ]);

    return rows[0];

};



/* ===========================================================
   DELETE
=========================================================== */

export const deleteSyllabusModel = async (

    syllabusId,
    teacherNumber

)=>{
const pool = getPool();
    const query=`

        DELETE FROM "syllabus"

        WHERE

            id=$1

        AND teacher_number=$2

        RETURNING id;

    `;

    const {rows}=await pool.query(query,[

        syllabusId,
        teacherNumber

    ]);

    return rows[0];

};

export const isTeacherAssignedModel = async (
    teacherNumber,
    sessionId,
    classId,
    sectionId,
    subjectId
) => {

    const pool = getPool();

    const query = `
        SELECT 1
        FROM "teacherAsignedClass"
        WHERE teacher_number = $1
          AND session_id = $2
          AND class_id = $3
          AND section_id = $4
          AND subject_id = $5
        LIMIT 1;
    `;

    const { rows } = await pool.query(query, [
        teacherNumber,
        sessionId,
        classId,
        sectionId,
        subjectId
    ]);

    return rows.length > 0;
};

// Ye model 5 APIs ke liye ready hai
// API	Model Function
// GET Assigned Dropdown	getAssignedOptionsModel()
// POST Create Syllabus	createSyllabusModel()
// GET Teacher Syllabus	getTeacherSyllabusModel()
// PATCH Status	updateSyllabusStatusModel()
// DELETE	deleteSyllabusModel()