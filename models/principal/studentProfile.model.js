import { getPool } from "../../config/postgressSupabaseDb.js";





/*
|--------------------------------------------------------------------------
| Get Student Basic Profile
|--------------------------------------------------------------------------
*/

const getStudentBasicProfile = async (

    admissionNumber

)=>{


    const pool = getPool();



    const query = `

    SELECT


        sp.admission_number,

        sp.roll_number,

        sp.student_name,

        sp.profile_photo,


        sp.gender,

        sp.date_of_birth,

        sp.blood_group,


        sp.father_name,

        sp.father_mobile,

        sp.father_occupation,


        sp.mother_name,

        sp.mother_mobile,

        sp.mother_occupation,


        sp.email,

        sp.address,

        sp.city,

        sp.state,

        sp.pincode,


        sp.transport,

        sp.hostel,


        sp.session,

        sp.class_name,

        sp.section



    FROM student_profiles sp



    WHERE

        sp.admission_number = $1



    LIMIT 1;


    `;



    const {rows}=await pool.query(

        query,

        [

            admissionNumber

        ]

    );



    return rows[0];

};









/*
|--------------------------------------------------------------------------
| Get Attendance Summary
|--------------------------------------------------------------------------
*/

const getStudentAttendance = async (

    admissionNumber

)=>{


    const pool=getPool();



    const query=`

    SELECT


        COUNT(ad.id)

        AS total_days,



        COUNT(

            CASE

            WHEN ad.status='Present'

            THEN 1

            END

        )

        AS present_days,




        COUNT(

            CASE

            WHEN ad.status='Absent'

            THEN 1

            END

        )

        AS absent_days,




        COUNT(

            CASE

            WHEN ad.status='Leave'

            THEN 1

            END

        )

        AS leave_days



    FROM attendance_detail ad



    WHERE

    ad.admission_number=$1;


    `;



    const {rows}=await pool.query(

        query,

        [

            admissionNumber

        ]

    );




    const data=rows[0];



    const percentage =


        Number(data.total_days) > 0


        ?


        (

            Number(data.present_days)

            /

            Number(data.total_days)

        )

        *

        100


        :

        0;





    return {


        total_days:

            Number(data.total_days),


        present_days:

            Number(data.present_days),


        absent_days:

            Number(data.absent_days),


        leave_days:

            Number(data.leave_days),


        percentage:

            percentage.toFixed(2)


    };


};












/*
|--------------------------------------------------------------------------
| Get Student Performance
|--------------------------------------------------------------------------
*/

const getStudentPerformance = async (

    admissionNumber

)=>{


    const pool=getPool();



    const query=`

    SELECT



        et.exam_name,


        sub.subject_name,


        md.obtained_marks,


        m.maximum_marks



    FROM marks_detail md



    JOIN marks m

    ON m.id = md.marks_id



    JOIN exam_types et

    ON et.id = m.exam_type_id



    JOIN subjects sub

    ON sub.id = m.subject_id



    WHERE


        md.admission_number=$1



    ORDER BY

        m.exam_date DESC;



    `;




    const {rows}=await pool.query(

        query,

        [

            admissionNumber

        ]

    );






    let totalObtained = 0;

    let totalMaximum = 0;




    const exams = rows.map(item=>{


        totalObtained +=

        Number(item.obtained_marks);



        totalMaximum +=

        Number(item.maximum_marks);




        return {


            exam_name:

                item.exam_name,


            subject:

                item.subject_name,


            obtained_marks:

                Number(item.obtained_marks),


            maximum_marks:

                Number(item.maximum_marks),



            percentage:


            (

                Number(item.obtained_marks)

                /

                Number(item.maximum_marks)

            )

            *

            100


        };


    });






    return {


        overall_percentage:


        totalMaximum > 0


        ?

        (

            totalObtained

            /

            totalMaximum

        )

        *

        100


        :

        0,



        exams



    };

};









/*
|--------------------------------------------------------------------------
| Main Student Profile Function
|--------------------------------------------------------------------------
*/

const getStudentProfile = async (

    admissionNumber

)=>{


    const student =

        await getStudentBasicProfile(

            admissionNumber

        );




    if(!student)

    return null;





    const attendance =

        await getStudentAttendance(

            admissionNumber

        );





    const performance =

        await getStudentPerformance(

            admissionNumber

        );






    return {


        basic:{


    admission_number:

    student.admission_number,


    roll_number:

    student.roll_number,


    student_name:

    student.student_name,


    profile_photo:

    student.profile_photo,


    gender:

    student.gender,


    date_of_birth:

    student.date_of_birth,


    blood_group:

    student.blood_group


},



        parents:{


            father_name:

            student.father_name,


            father_mobile:

            student.father_mobile,


            father_occupation:

            student.father_occupation,


            mother_name:

            student.mother_name,


            mother_mobile:

            student.mother_mobile,


            mother_occupation:

            student.mother_occupation

        },



        contact:{


            email:

            student.email,


            address:

            student.address,


            city:

            student.city,


            state:

            student.state,


            pincode:

            student.pincode


        },



        school:{


            session:

            student.session,


            class_name:

            student.class_name,


            section:

            student.section,


            transport:

            student.transport,


            hostel:

            student.hostel


        },



        attendance,


        performance



    };


};






export {


    getStudentProfile

};