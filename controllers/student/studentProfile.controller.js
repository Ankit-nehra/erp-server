import {findStudentProfileByAdmissionNumber} from "../../models/student/studentProfile.model.js";

export const getStudentProfile = async(req,res)=>{


try{


const admissionNumber =
req.user.admissionNumber;



const profile =
await findStudentProfileByAdmissionNumber(
admissionNumber
);



if(!profile){

return res.status(404).json({

success:false,
message:"Profile not found"

});

}



res.json({

success:true,

profile

});


}
catch(error){


console.log(error);


res.status(500).json({

message:"Server error"

});


}


};