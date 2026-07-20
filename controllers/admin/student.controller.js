import {

    getActiveSession,

    getClasses,

    getSections,

    createStudentLogin,

    createStudentProfile,

    getAllStudents,

    getStudentById,

    updateStudent,

    deleteStudent


}
from "../../models/admin/student.model.js";







/*
|--------------------------------------------------------------------------
| Get Classes
|--------------------------------------------------------------------------
*/


export const fetchClasses = async(req,res)=>{


try{


const classes = await getClasses();



return res.status(200).json({

success:true,

data:classes

});


}

catch(error){


console.log(
"Fetch classes error:",
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
| Get Sections
|--------------------------------------------------------------------------
*/


export const fetchSections = async(req,res)=>{


try{


const sections = await getSections();



return res.status(200).json({

success:true,

data:sections

});


}

catch(error){


console.log(
"Fetch sections error:",
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
| Add Student Admission
|--------------------------------------------------------------------------
*/


export const addStudent = async(req,res)=>{


try{


const body=req.body;



const session =

await getActiveSession();





if(!session){


return res.status(404).json({

success:false,

message:"Active session not found"

});


}







/*
-------------------------------
Validation
-------------------------------
*/


if(

!body.admission_number ||

!body.student_name ||

!body.roll_number ||

!body.class_name ||

!body.section

){


return res.status(400).json({

success:false,

message:

"Required fields missing"

});


}










/*
-------------------------------
Create Student Login
-------------------------------
*/


await createStudentLogin({

admissionNumber:

body.admission_number,


password:

body.password || body.admission_number



});









/*
-------------------------------
Create Profile
-------------------------------
*/


const student =

await createStudentProfile({


...body,


session:

session.session_name



});






return res.status(201).json({

success:true,

message:

"Student admitted successfully",


data:student


});





}

catch(error){



console.log(

"Add student error:",

error

);




return res.status(500).json({

success:false,

message:

"Student admission failed"


});


}


};









/*
|--------------------------------------------------------------------------
| Get All Students
|--------------------------------------------------------------------------
*/


export const fetchStudents = async(req,res)=>{


try{


const students =

await getAllStudents();



return res.status(200).json({

success:true,

data:students


});


}

catch(error){


console.log(

"Get students error:",

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
| Get Student Detail
|--------------------------------------------------------------------------
*/


export const fetchStudentDetail = async(req,res)=>{


try{


const {id}=req.params;



const student =

await getStudentById(id);




if(!student){


return res.status(404).json({

success:false,

message:"Student not found"

});


}




return res.status(200).json({

success:true,

data:student


});


}


catch(error){



console.log(

"Student detail error:",

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
| Update Student
|--------------------------------------------------------------------------
*/


export const editStudent = async(req,res)=>{


try{


const {id}=req.params;



const student =

await updateStudent(

id,

req.body

);




return res.status(200).json({

success:true,

message:

"Student updated successfully",


data:student


});



}

catch(error){


console.log(

"Update student error:",

error

);



return res.status(500).json({

success:false,

message:"Update failed"

});


}


};









/*
|--------------------------------------------------------------------------
| Delete Student
|--------------------------------------------------------------------------
*/


export const removeStudent = async(req,res)=>{


try{


const {id}=req.params;



await deleteStudent(id);



return res.status(200).json({

success:true,

message:

"Student deleted successfully"

});


}

catch(error){


console.log(

"Delete student error:",

error

);



return res.status(500).json({

success:false,

message:"Delete failed"

});


}


};