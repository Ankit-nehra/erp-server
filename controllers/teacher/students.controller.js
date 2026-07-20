import {

    getActiveSession,

    getTeacherAssignments,

    verifyTeacherAssignment,

    getStudents

}
from "../../models/teacher/students.model.js";









/*
|--------------------------------------------------------------------------
| Get Teacher Assigned Classes / Sections
|--------------------------------------------------------------------------
*/

export const getStudentOptions = async (

    req,

    res

) => {


    try {


        const teacherNumber =

            req.user.teacherNumber;




        if (!teacherNumber) {


            return res.status(400).json({

                success:false,

                message:"Teacher number missing"

            });


        }







        const session =

            await getActiveSession();





        if (!session) {


            return res.status(404).json({

                success:false,

                message:"Active session not found"

            });


        }







        const assignments =

            await getTeacherAssignments(

                teacherNumber,

                session.id

            );








        return res.status(200).json({

            success:true,

            data:assignments


        });





    }

    catch(error){


        console.log(

            "Student options error:",

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
| Get Teacher Students
|--------------------------------------------------------------------------
*/

export const getTeacherStudents = async (

    req,

    res

) => {


    try {



        const teacherNumber =

            req.user.teacherNumber;





        if(!teacherNumber){


            return res.status(400).json({

                success:false,

                message:"Teacher number missing"

            });


        }








        const {


            class_id,

            section_id


        } = req.query;







        if(

            !class_id ||

            !section_id

        ){


            return res.status(400).json({

                success:false,

                message:

                "Class and Section are required"

            });


        }








        const session =

            await getActiveSession();







        if(!session){


            return res.status(404).json({

                success:false,

                message:"Active session not found"

            });


        }









        const isAssigned =

            await verifyTeacherAssignment({



                teacherNumber,



                sessionId:

                    session.id,



                classId:

                    Number(class_id),



                sectionId:

                    Number(section_id)



            });









        if(!isAssigned){


            return res.status(403).json({

                success:false,

                message:

                "Teacher is not assigned to this class"


            });


        }









        const students =

            await getStudents({



                sessionName:

                    session.session_name,



                classId:

                    Number(class_id),



                sectionId:

                    Number(section_id)



            });












        let classAttendance = "0%";



        if(students.length > 0){



            classAttendance =

            `${

                students[0]

                .class_attendance_percentage || 0

            }%`;



        }









        /*
        |--------------------------------------------------------------------------
        | Gender Count
        |--------------------------------------------------------------------------
        */


        const totalBoys =

            students.filter(

                student =>

                student.gender?.toLowerCase()

                === "male"

            ).length;






        const totalGirls =

            students.filter(

                student =>

                student.gender?.toLowerCase()

                === "female"

            ).length;












        return res.status(200).json({



            success:true,



            summary:{



                total_students:

                    students.length,



                total_boys:

                    totalBoys,



                total_girls:

                    totalGirls,



                class_attendance:

                    classAttendance



            },



            students



        });







    }

    catch(error){



        console.log(

            "Teacher students error:",

            error

        );



        return res.status(500).json({

            success:false,

            message:"Internal Server Error"

        });


    }


};