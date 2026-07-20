import {
    getActiveSession
} from "../../models/student/attendance.model.js";

import {
    getAttendanceSummary,
    getMonthlyAttendance,
    getDailyAttendance,
    getMonthlyDetail,
    getSubjectWiseAttendance
} from "../../models/student/attendance.model.js";





/*
|--------------------------------------------------------------------------
| Student Attendance Dashboard
|--------------------------------------------------------------------------
|
| Overall summary
| Monthly chart
| Subject wise
|
*/

const getStudentAttendance = async(req,res)=>{


try{

console.log("USER DATA:", req.user);
const admissionNumber =
req.user.admissionNumber;



if(!admissionNumber){

return res.status(400).json({

success:false,

message:"Student admission number missing"

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





const summary =
await getAttendanceSummary({

admissionNumber,

sessionId:session.id

});






const monthly =
await getMonthlyAttendance({

admissionNumber,

sessionId:session.id

});







const subjectWise =
await getSubjectWiseAttendance({

admissionNumber,

sessionId:session.id

});






return res.status(200).json({

success:true,


data:{


summary,


monthly,


subjectWise


}



});





}
catch(error){


console.log(
"Student attendance error:",
error
);



return res.status(500).json({

success:false,

message:"Server error"

});


}


};









/*
|--------------------------------------------------------------------------
| Complete Attendance History
|--------------------------------------------------------------------------
|
| Every period detail
| date
| subject
| teacher
| status
|
*/

const getStudentAttendanceHistory = async(req,res)=>{


try{

    console.log(
"========== HISTORY API =========="
);



console.log(
"USER:",
req.user
);


const admissionNumber =
req.user.admissionNumber;



const session =
await getActiveSession();





if(!session){


return res.status(404).json({

success:false,

message:"Active session not found"

});


}






const history =
await getDailyAttendance({

admissionNumber,

sessionId:session.id

});







return res.status(200).json({

success:true,

data:history

});





}
catch(error){


console.log(
"Attendance history error:",
error
);



return res.status(500).json({

success:false,

message:"Server error"

});


}



};









/*
|--------------------------------------------------------------------------
| Particular Month Attendance Detail
|--------------------------------------------------------------------------
|
| Example:
| January ki saari classes
|
*/
const getStudentMonthlyDetail = async(req,res)=>{


try{


const admissionNumber =
req.user.admissionNumber;



const month = Number(req.params.month);



console.log(
"========== MONTH DETAIL API =========="
);


console.log(
"USER:",
req.user
);


console.log(
"MONTH PARAM:",
req.params.month
);


console.log(
"CONVERTED MONTH:",
month
);



if(!month || month < 1 || month > 12){


return res.status(400).json({

success:false,

message:"Invalid month"

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





const details =
await getMonthlyDetail({

admissionNumber,

sessionId:session.id,

month

});





console.log(
"MONTH DETAIL RESPONSE:",
details
);





return res.status(200).json({

success:true,

data:details

});





}
catch(error){


console.log(
"Monthly attendance detail error:",
error
);



return res.status(500).json({

success:false,

message:"Server error"

});


}


};








export {


getStudentAttendance,

getStudentAttendanceHistory,

getStudentMonthlyDetail


};