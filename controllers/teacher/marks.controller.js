import {

    getTeacherAssignments,

    verifyTeacherAssignment,

    getExamTypes,

    getStudents,

    getMarks,

    getMarksDetails,

    createMarksRecord,

    createMarksDetails,

    deleteMarksRecord,

    getActiveSession


}
from "../../models/teacher/marks.model.js";



import {
    getPool
}
from "../../config/postgressSupabaseDb.js";









/*
|--------------------------------------------------------------------------
| Get Marks Options
|--------------------------------------------------------------------------
|
| Teacher assigned class
| section
| subject
| exam types
|
|--------------------------------------------------------------------------
*/


const getMarksOptions = async(req,res)=>{


try{


const teacherNumber =
req.user.teacherNumber;



const session =
await getActiveSession();




if(!session){


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




const exams =
await getExamTypes();





return res.status(200).json({

success:true,

data:{

assignments,

exams

}

});





}
catch(error){


console.log(
"Marks Options Error:",
error
);



return res.status(500).json({

success:false,

message:"Server Error"

});


}



};









/*
|--------------------------------------------------------------------------
| Get Students For Marks
|--------------------------------------------------------------------------
|
| Load students
| Check existing marks
|
|--------------------------------------------------------------------------
*/


const getMarksStudents = async(req,res)=>{

console.log("MARKS QUERY:", req.query);
try{


const {


class_id,

section_id,

subject_id,

exam_type_id,

// test_name,

exam_date


}=req.query;






if(

!class_id ||

!section_id ||

!subject_id ||

!exam_type_id ||

!exam_date

){


return res.status(400).json({

success:false,

message:"All fields required"

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









// Verify teacher assignment


const assigned =

await verifyTeacherAssignment({

teacherNumber:
req.user.teacherNumber,


sessionId:
session.id,


classId:
class_id,


sectionId:
section_id,


subjectId:
subject_id


});






if(!assigned){


return res.status(403).json({

success:false,

message:
"Teacher not assigned this class"

});


}








// Check existing marks


const existing =

await getMarks({

sessionId:
session.id,


classId:
class_id,


sectionId:
section_id,


subjectId:
subject_id,


examTypeId:
exam_type_id,





examDate:
exam_date


});







let students = [];





if(existing){


students =

await getMarksDetails(

existing.id

);


}
else{


students =

await getStudents({

sessionName:
session.session_name,


classId:
class_id,


sectionId:
section_id


});


}








return res.status(200).json({


success:true,


alreadySubmitted:
!!existing,


marks_id:
existing?.id || null,


students


});







}
catch(error){


console.log(

"Get Marks Students Error:",

error.message

);

console.log(error.stack);

return res.status(500).json({

success:false,

message:"Server Error"

});


}



};













/*
|--------------------------------------------------------------------------
| Create Marks
|--------------------------------------------------------------------------
|
| Insert marks master
| Insert marks details
|
|--------------------------------------------------------------------------
*/


const createMarks = async(req,res)=>{


const pool =
getPool();


const client =
await pool.connect();




try{


const {


class_id,

section_id,

subject_id,

exam_type_id,



exam_date,

maximum_marks,

passing_marks,

students


}=req.body;








if(

!class_id ||

!section_id ||

!subject_id ||

!exam_type_id ||

!exam_date ||

!maximum_marks ||

!students ||

students.length===0

){


return res.status(400).json({

success:false,

message:"Invalid Data"

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









// Verify Assignment


const assigned =

await verifyTeacherAssignment({

teacherNumber:
req.user.teacherNumber,


sessionId:
session.id,


classId:
class_id,


sectionId:
section_id,


subjectId:
subject_id


});







if(!assigned){


return res.status(403).json({

success:false,

message:
"Teacher not assigned this subject"

});


}








// Check duplicate


const exists =

await getMarks({

sessionId:
session.id,


classId:
class_id,


sectionId:
section_id,


subjectId:
subject_id,


examTypeId:
exam_type_id,





examDate:
exam_date


});







if(exists){


return res.status(409).json({

success:false,

message:
"Marks already submitted"

});


}









try{


await client.query(
"BEGIN"
);







const marks =

await createMarksRecord(

client,

{

sessionId:
session.id,


classId:
class_id,


sectionId:
section_id,


subjectId:
subject_id,


examTypeId:
exam_type_id,


teacherNumber:
req.user.teacherNumber,





examDate:
exam_date,


maximumMarks:
maximum_marks,


passingMarks:
passing_marks || 0


}

);







await createMarksDetails(

client,

marks.id,

students,

maximum_marks

);








await client.query(
"COMMIT"
);







return res.status(201).json({

success:true,

message:
"Marks uploaded successfully",

data:marks


});







}
catch(error){


await client.query(
"ROLLBACK"
);


throw error;


}






}
catch(error){


console.log(

"Create Marks Error:",

error

);



return res.status(500).json({

success:false,

message:"Server Error"

});


}
finally{


client.release();


}



};












/*
|--------------------------------------------------------------------------
| Delete Marks
|--------------------------------------------------------------------------
|
| Teacher can delete own marks
|
|--------------------------------------------------------------------------
*/


const deleteMarks = async(req,res)=>{


try{


const marksId =
req.params.id;



const teacherNumber =
req.user.teacherNumber;







const deleted =

await deleteMarksRecord(

marksId,

teacherNumber

);







if(!deleted){


return res.status(404).json({

success:false,

message:
"Marks record not found"

});


}








return res.status(200).json({

success:true,

message:
"Marks deleted successfully"

});







}
catch(error){


console.log(

"Delete Marks Error:",

error

);



return res.status(500).json({

success:false,

message:"Server Error"

});


}



};








export {


getMarksOptions,

getMarksStudents,

createMarks,

deleteMarks


};