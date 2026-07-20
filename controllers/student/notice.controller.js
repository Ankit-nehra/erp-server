import noticesModel from "../../models/student/noticesModel.js";




export const getStudentNotices = async(
req,
res
)=>{


try{


const admission_number =
req.user.admissionNumber;



console.log(
    "Student Admission:",
    admission_number
);



const notices =

await noticesModel.getStudentNotices(

    admission_number

);



return res.status(200).json({

    success:true,

    count:notices.length,

    data:notices

});



}
catch(error){


console.error(
    "Student Notice Error:",
    error
);



return res.status(500).json({

    success:false,

    message:"Internal server error"

});


}


};