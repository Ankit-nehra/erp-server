import {

    getStudentProfile

}
from "../../models/principal/studentProfile.model.js";








/*
|--------------------------------------------------------------------------
| Get Principal Student Complete Profile
|--------------------------------------------------------------------------
|
| URL:
|
| GET /principal/student-profile/:admission_number
|
*/

export const getPrincipalStudentProfile = async (

    req,

    res

) => {


    try {


        const {

            admission_number

        } = req.params;





        if(!admission_number){


            return res.status(400).json({

                success:false,

                message:

                "Admission number is required"

            });


        }







        const student =

            await getStudentProfile(

                admission_number

            );









        if(!student){


            return res.status(404).json({

                success:false,

                message:

                "Student not found"

            });


        }









        return res.status(200).json({

            success:true,

            student


        });





    }

    catch(error){



        console.log(

            "Principal student profile error:",

            error

        );



        return res.status(500).json({

            success:false,

            message:

            "Internal Server Error"

        });



    }


};