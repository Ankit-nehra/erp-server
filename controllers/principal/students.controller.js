import {

    getStudentOptions,

    getStudentsList

}
from "../../models/principal/students.model.js";





/*
|--------------------------------------------------------------------------
| Get Principal Student Options
|--------------------------------------------------------------------------
|
| Returns:
| Sessions
| Classes
| Sections
|
*/

export const getPrincipalStudentOptions = async (

    req,

    res

) => {


    try {


        const data =

            await getStudentOptions();




        return res.status(200).json({

            success:true,

            data

        });



    }

    catch(error){


        console.log(

            "Principal student options error:",

            error

        );



        return res.status(500).json({

            success:false,

            message:"Internal Server Error"

        });


    }


};









/*
|--------------------------------------------------------------------------
| Get Principal Students
|--------------------------------------------------------------------------
|
| Query:
|
| session_id
| class_id
| section_id
|
*/

export const getPrincipalStudents = async (

    req,

    res

) => {


    try {



        const {

            session_id,

            class_id,

            section_id


        } = req.query;







        if(

            !session_id ||

            !class_id ||

            !section_id

        ){


            return res.status(400).json({

                success:false,

                message:

                "Session, Class and Section are required"

            });


        }







        const students =

            await getStudentsList({

                sessionId:

                    Number(session_id),


                classId:

                    Number(class_id),


                sectionId:

                    Number(section_id)

            });









        /*
        |--------------------------------------------------------------------------
        | Summary
        |--------------------------------------------------------------------------
        */


        const totalStudents =

            students.length;





        const totalBoys =

            students.filter(

                student =>

                student.gender

                ?.toLowerCase()

                === "male"

            ).length;







        const totalGirls =

            students.filter(

                student =>

                student.gender

                ?.toLowerCase()

                === "female"

            ).length;









        const averageAttendance =


            totalStudents > 0

            ?

            (

                students.reduce(

                    (sum,student)=>

                    sum +

                    Number(

                        student.attendance_percentage || 0

                    ),

                    0

                )

                /

                totalStudents

            ).toFixed(2)


            :

            "0.00";









        const averagePerformance =


            totalStudents > 0

            ?

            (

                students.reduce(

                    (sum,student)=>

                    sum +

                    Number(

                        student.performance_percentage || 0

                    ),

                    0

                )

                /

                totalStudents

            ).toFixed(2)


            :

            "0.00";









        return res.status(200).json({

            success:true,


            summary:{


                total_students:

                    totalStudents,


                total_boys:

                    totalBoys,


                total_girls:

                    totalGirls,


                average_attendance:

                    `${averageAttendance}%`,



                average_performance:

                    `${averagePerformance}%`


            },


            students


        });





    }

    catch(error){



        console.log(

            "Principal students error:",

            error

        );



        return res.status(500).json({

            success:false,

            message:"Internal Server Error"

        });



    }


};