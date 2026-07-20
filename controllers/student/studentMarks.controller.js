import {
    getStudentMarks
}
from "../../models/student/studentMarks.model.js";





const fetchStudentMarks = async(req,res)=>{


try{


    const admissionNumber =
    req.user.admissionNumber;



    const marks =
    await getStudentMarks(
        admissionNumber
    );



    return res.status(200).json({

        success:true,

        data:marks

    });



}
catch(error){


    console.log(
        "Student Marks Error:",
        error
    );


    return res.status(500).json({

        success:false,

        message:"Server Error"

    });


}



};




export {

    fetchStudentMarks

};