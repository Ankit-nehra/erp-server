// import { getPool } from "../../config/postgressSupabaseDb.js";



// /*
// |--------------------------------------------------------------------------
// | Get Student Attendance Summary
// |--------------------------------------------------------------------------
// */

// const getAttendanceSummary = async ({
//     admissionNumber,
//     sessionId
// }) => {


//     const pool = getPool();



//     const query = `

//     SELECT


//         COUNT(*) FILTER(
//             WHERE ad.status='Present'
//         ) AS present,


//         COUNT(*) FILTER(
//             WHERE ad.status='Absent'
//         ) AS absent,


//         COUNT(*) FILTER(
//             WHERE ad.status='Leave'
//         ) AS leave,


//         COUNT(*) AS total


//     FROM "attendance_detail" ad


//     JOIN "attendance" a

//         ON a.id = ad.attendance_id



//     WHERE

//         ad.admission_number = $1

//         AND a.session_id = $2;


//     `;



//     const {rows} = await pool.query(
//         query,
//         [
//             admissionNumber,
//             sessionId
//         ]
//     );



//     const data = rows[0];



//     const percentage =
//         data.total > 0
//         ?
//         Math.round(
//             (data.present / data.total) * 100
//         )
//         :
//         0;



//     return {

//         present:Number(data.present),

//         absent:Number(data.absent),

//         leave:Number(data.leave),

//         total:Number(data.total),

//         percentage

//     };


// };






// /*
// |--------------------------------------------------------------------------
// | Monthly Attendance
// |--------------------------------------------------------------------------
// */

// const getMonthlyAttendance = async({

//     admissionNumber,
//     sessionId

// })=>{


// const pool=getPool();



// const query=`


// SELECT


// TO_CHAR(
//     a.attendance_date,
//     'Month'
// ) AS month,



// COUNT(*) FILTER(
// WHERE ad.status='Present'
// ) AS present,



// COUNT(*) FILTER(
// WHERE ad.status='Absent'
// ) AS absent,



// COUNT(*) FILTER(
// WHERE ad.status='Leave'
// ) AS leave



// FROM "attendance_detail" ad



// JOIN "attendance" a

// ON a.id = ad.attendance_id



// WHERE

// ad.admission_number=$1

// AND a.session_id=$2



// GROUP BY

// TO_CHAR(
// a.attendance_date,
// 'Month'
// ),


// DATE_PART(
// 'month',
// a.attendance_date
// )



// ORDER BY

// DATE_PART(
// 'month',
// a.attendance_date
// );



// `;



// const {rows}=await pool.query(
// query,
// [
// admissionNumber,
// sessionId
// ]
// );



// return rows.map(item=>{


// const total =
// Number(item.present)
// +
// Number(item.absent)
// +
// Number(item.leave);



// return {

// month:item.month.trim(),

// present:Number(item.present),

// absent:Number(item.absent),

// leave:Number(item.leave),

// percentage:
// total
// ?
// Math.round(
// (Number(item.present)/total)*100
// )
// :
// 0


// };


// });


// };







// /*
// |--------------------------------------------------------------------------
// | Daily Attendance Detail
// |--------------------------------------------------------------------------
// |
// | Date + Subject + Teacher + Period
// |
// */

// const getDailyAttendance = async({

// admissionNumber,

// sessionId

// })=>{


// const pool=getPool();



// const query=`


// SELECT


// a.attendance_date,


// a.period_number,



// sub.subject_name,


// sub.subject_code,



// t.teacher_name,



// ad.status



// FROM "attendance_detail" ad



// JOIN "attendance" a

// ON a.id = ad.attendance_id



// JOIN subjects sub

// ON sub.id=a.subject_id



// LEFT JOIN teachers t

// ON t.teacher_number=a.teacher_number



// WHERE


// ad.admission_number=$1

// AND a.session_id=$2



// ORDER BY


// a.attendance_date DESC,

// a.period_number ASC;



// `;



// const {rows}=await pool.query(

// query,

// [
// admissionNumber,
// sessionId
// ]

// );



// return rows;



// };










// /*
// |--------------------------------------------------------------------------
// | Monthly Detail
// |--------------------------------------------------------------------------
// |
// | Particular month ki har class
// |
// */

// const getMonthlyDetail = async({

// admissionNumber,

// sessionId,

// month

// })=>{


// const pool=getPool();



// const query=`


// SELECT


// a.attendance_date,


// a.period_number,


// sub.subject_name,


// t.teacher_name,


// ad.status



// FROM "attendance_detail" ad



// JOIN attendance a

// ON a.id=ad.attendance_id



// JOIN subjects sub

// ON sub.id=a.subject_id



// LEFT JOIN teachers t

// ON t.teacher_number=a.teacher_number



// WHERE


// ad.admission_number=$1


// AND a.session_id=$2


// AND EXTRACT(
// MONTH FROM a.attendance_date
// )= $3



// ORDER BY


// a.attendance_date,

// a.period_number;



// `;



// const {rows}=await pool.query(

// query,

// [
// admissionNumber,
// sessionId,
// month
// ]

// );



// return rows;


// };








// /*
// |--------------------------------------------------------------------------
// | Subject Wise Attendance
// |--------------------------------------------------------------------------
// */

// const getSubjectWiseAttendance = async({

// admissionNumber,

// sessionId

// })=>{


// const pool=getPool();



// const query=`


// SELECT


// sub.subject_name,


// COUNT(*) FILTER(
// WHERE ad.status='Present'
// ) AS present,


// COUNT(*) FILTER(
// WHERE ad.status='Absent'
// ) AS absent,


// COUNT(*) FILTER(
// WHERE ad.status='Leave'
// ) AS leave



// FROM attendance_detail ad



// JOIN attendance a

// ON a.id=ad.attendance_id



// JOIN subjects sub

// ON sub.id=a.subject_id



// WHERE

// ad.admission_number=$1

// AND a.session_id=$2



// GROUP BY

// sub.subject_name;



// `;



// const {rows}=await pool.query(

// query,

// [
// admissionNumber,
// sessionId
// ]

// );



// return rows;


// };

// /*
// |--------------------------------------------------------------------------
// | Get Active Academic Session
// |--------------------------------------------------------------------------
// */

// const getActiveSession = async () => {

//     const pool = getPool();

//     const query = `

//     SELECT
//         id,
//         session_name,
//         start_date,
//         end_date

//     FROM sessions

//     WHERE is_active = true

//     LIMIT 1;

//     `;


//     const { rows } = await pool.query(query);


//     return rows[0] || null;

// };




// export {
// getActiveSession,
// getAttendanceSummary,

// getMonthlyAttendance,

// getDailyAttendance,

// getMonthlyDetail,

// getSubjectWiseAttendance

// };
import { getPool } from "../../config/postgressSupabaseDb.js";



/*
|--------------------------------------------------------------------------
| Active Session
|--------------------------------------------------------------------------
*/

const getActiveSession = async () => {

    const pool = getPool();

    const query = `

    SELECT
        id,
        session_name,
        start_date,
        end_date

    FROM sessions

    WHERE is_active = true

    LIMIT 1;

    `;


    const { rows } = await pool.query(query);


    return rows[0] || null;

};





/*
|--------------------------------------------------------------------------
| Attendance Summary
|--------------------------------------------------------------------------
*/

const getAttendanceSummary = async ({
    admissionNumber,
    sessionId
}) => {


    const pool = getPool();


    const query = `

    SELECT


    COUNT(*) FILTER(
        WHERE ad.status='Present'
    ) AS present,


    COUNT(*) FILTER(
        WHERE ad.status='Absent'
    ) AS absent,


    COUNT(*) FILTER(
        WHERE ad.status='Leave'
    ) AS leave,


    COUNT(*) AS total


    FROM attendance_detail ad


    JOIN attendance a

    ON a.id = ad.attendance_id


    WHERE

    ad.admission_number=$1

    AND a.session_id=$2;


    `;



    const {rows}=await pool.query(
        query,
        [
            admissionNumber,
            sessionId
        ]
    );



    const data=rows[0];



    const percentage =
    Number(data.total)>0
    ?
    Math.round(
        (Number(data.present)/Number(data.total))*100
    )
    :
    0;



    return {

        present:Number(data.present),

        absent:Number(data.absent),

        leave:Number(data.leave),

        total:Number(data.total),

        percentage

    };


};







/*
|--------------------------------------------------------------------------
| Monthly Attendance
|--------------------------------------------------------------------------
*/

const getMonthlyAttendance = async ({
    admissionNumber,
    sessionId
})=>{


    const pool=getPool();



    const query=`

    SELECT


    TRIM(
        TO_CHAR(
            a.attendance_date,
            'Month'
        )
    ) AS month,


    DATE_PART(
        'month',
        a.attendance_date
    ) AS month_number,



    COUNT(*) FILTER(
        WHERE ad.status='Present'
    ) AS present,



    COUNT(*) FILTER(
        WHERE ad.status='Absent'
    ) AS absent,



    COUNT(*) FILTER(
        WHERE ad.status='Leave'
    ) AS leave



    FROM attendance_detail ad



    JOIN attendance a

    ON a.id=ad.attendance_id



    WHERE

    ad.admission_number=$1

    AND a.session_id=$2



    GROUP BY

    month,

    month_number



    ORDER BY

    month_number;


    `;



    const {rows}=await pool.query(
        query,
        [
            admissionNumber,
            sessionId
        ]
    );



    return rows.map(item=>{


        const total =
        Number(item.present)
        +
        Number(item.absent)
        +
        Number(item.leave);



        return {


            month:item.month,


            monthNumber:Number(item.month_number),


            present:Number(item.present),


            absent:Number(item.absent),


            leave:Number(item.leave),


            percentage:
            total>0
            ?
            Math.round(
                (Number(item.present)/total)*100
            )
            :
            0


        };


    });


};








/*
|--------------------------------------------------------------------------
| Complete Attendance History
|--------------------------------------------------------------------------
*/

const getDailyAttendance = async ({
    admissionNumber,
    sessionId
}) => {

    const pool = getPool();


    const query = `

    SELECT


    a.attendance_date,


    a.period_number,


    sub.subject_name,


    sub.subject_code,


    t.teacher_name,


    ad.status 



    FROM attendance_detail ad



    JOIN attendance a

    ON a.id = ad.attendance_id



    JOIN subjects sub

    ON sub.id = a.subject_id



    LEFT JOIN teacher_profiles t

    ON t.teacher_number = a.teacher_number



    WHERE


    ad.admission_number = $1


    AND a.session_id = $2



    ORDER BY


    a.attendance_date DESC,


    a.period_number ASC;



    `;


    console.log("DAILY ATTENDANCE PARAMS:", {
        admissionNumber,
        sessionId
    });



    const { rows } = await pool.query(
        query,
        [
            admissionNumber,
            sessionId
        ]
    );


    console.log(
        "DAILY ATTENDANCE DATA:",
        rows
    );


    return rows;

};









/*
|--------------------------------------------------------------------------
| Monthly Detail
|--------------------------------------------------------------------------
*/
const getMonthlyDetail = async ({
    admissionNumber,
    sessionId,
    month
}) => {


    const pool = getPool();



    const query = `


    SELECT


    a.attendance_date,


    a.period_number,


    sub.subject_name,


    sub.subject_code,


    t.teacher_name,


    ad.status 



    FROM attendance_detail ad



    JOIN attendance a

    ON a.id = ad.attendance_id



    JOIN subjects sub

    ON sub.id = a.subject_id



    LEFT JOIN teacher_profiles t

    ON t.teacher_number = a.teacher_number



    WHERE


    ad.admission_number = $1


    AND a.session_id = $2


    AND EXTRACT(
        MONTH FROM a.attendance_date
    ) = $3



    ORDER BY


    a.attendance_date,


    a.period_number;



    `;



    console.log("MONTH DETAIL PARAMS:", {
        admissionNumber,
        sessionId,
        month
    });



    const { rows } = await pool.query(
        query,
        [
            admissionNumber,
            sessionId,
            month
        ]
    );



    console.log(
        "MONTH DETAIL DATA:",
        rows
    );



    return rows;


};






/*
|--------------------------------------------------------------------------
| Subject Wise Attendance
|--------------------------------------------------------------------------
*/

const getSubjectWiseAttendance = async ({
    admissionNumber,
    sessionId
})=>{


    const pool=getPool();



    const query=`

    SELECT


    sub.subject_name,


    COUNT(*) FILTER(
        WHERE ad.status='Present'
    ) AS present,


    COUNT(*) FILTER(
        WHERE ad.status='Absent'
    ) AS absent,


    COUNT(*) FILTER(
        WHERE ad.status='Leave'
    ) AS leave



    FROM attendance_detail ad



    JOIN attendance a

    ON a.id=ad.attendance_id



    JOIN subjects sub

    ON sub.id=a.subject_id



    WHERE

    ad.admission_number=$1

    AND a.session_id=$2



    GROUP BY

    sub.subject_name;



    `;



    const {rows}=await pool.query(
        query,
        [
            admissionNumber,
            sessionId
        ]
    );


    return rows;


};






export {

getActiveSession,

getAttendanceSummary,

getMonthlyAttendance,

getDailyAttendance,

getMonthlyDetail,

getSubjectWiseAttendance

};