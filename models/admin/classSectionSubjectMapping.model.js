import { getPool } from "../../config/postgressSupabaseDb.js";



// Get All Class Section Subject Mappings
export const getAllClassSectionSubjectMappings = async () => {

    const pool = getPool();

    const result = await pool.query(
        `
        SELECT

            cssm.id,

            c.id AS class_id,
            c.class_name,

            sec.id AS section_id,
            sec.section_name,

            sub.id AS subject_id,
            sub.subject_name,
            sub.subject_code

        FROM "classSectionSubjectMapping" cssm

        INNER JOIN classes c
        ON c.id = cssm.class_id

        INNER JOIN sections sec
        ON sec.id = cssm.section_id

        INNER JOIN subjects sub
        ON sub.id = cssm.subject_id

        ORDER BY
            c.class_name,
            sec.section_name,
            sub.subject_name;
        `
    );

    return result.rows;

};



// Create Mapping
export const createClassSectionSubjectMapping = async ({
    class_id,
    section_id,
    subject_id
}) => {

    const pool = getPool();

    const result = await pool.query(
        `
        INSERT INTO "classSectionSubjectMapping"
        (
            class_id,
            section_id,
            subject_id
        )

        VALUES
        (
            $1,
            $2,
            $3
        )

        RETURNING *;
        `,
        [
            class_id,
            section_id,
            subject_id
        ]
    );

    return result.rows[0];

};



// Delete Mapping
export const deleteClassSectionSubjectMapping = async (id) => {

    const pool = getPool();

    const result = await pool.query(
        `
        DELETE FROM "classSectionSubjectMapping"

        WHERE id = $1

        RETURNING *;
        `,
        [
            id
        ]
    );

    return result.rows[0];

};

// Get Sections By Class
export const getSectionsByClassId = async (class_id) => {

    const pool = getPool();

    const result = await pool.query(
        `
        SELECT DISTINCT

            sec.id,

            sec.section_name

        FROM "classSectionSubjectMapping" cssm

        INNER JOIN sections sec
        ON sec.id = cssm.section_id

        WHERE cssm.class_id = $1

        ORDER BY sec.section_name;
        `,
        [
            class_id
        ]
    );

    return result.rows;

};

// Get Subjects By Class & Section
export const getSubjectsByClassAndSection = async (
    class_id,
    section_id
) => {

    const pool = getPool();

    const result = await pool.query(
        `
        SELECT DISTINCT

            sub.id AS subject_id,

            sub.subject_name,

            sub.subject_code

        FROM "classSectionSubjectMapping" cssm

        INNER JOIN subjects sub
        ON sub.id = cssm.subject_id

        WHERE
            cssm.class_id = $1
        AND
            cssm.section_id = $2

        ORDER BY sub.subject_name;
        `,
        [
            class_id,
            section_id
        ]
    );

    return result.rows;

};