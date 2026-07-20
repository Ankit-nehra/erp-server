import {

getStudentSyllabusModel

}
from "../../models/student/syllabus.model.js";





export const getStudentSyllabus = async(req,res)=>{


try{


const admissionNumber =
req.user.admissionNumber;



const data =
await getStudentSyllabusModel(
    admissionNumber
);



return res.status(200).json({

success:true,

data

});


}
catch(error){


console.log(error);



return res.status(500).json({

success:false,

message:"Internal Server Error"

});


}


};