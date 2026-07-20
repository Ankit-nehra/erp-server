import {

getTimetable,

createTimetable,

deleteTimetable,

getTeachersByClassSection,

checkTeacherAssignment,

getSubjectsByTeacher

}

from "../../models/admin/timetable.model.js";









export const fetchTimetable = async(req,res)=>{


try{


const timetable =
await getTimetable();



return res.status(200).json({

timetable

});


}
catch(error){


console.log(error);



return res.status(500).json({

message:"Server Error"

});


}


};









export const addTimetable = async(req,res)=>{


try{


const data=req.body;



// first verify teacher assignment


const assigned =
await checkTeacherAssignment(data);



if(!assigned){


return res.status(400).json({

message:
"Teacher is not assigned to this class and subject"

});


}






const timetable =
await createTimetable(data);



return res.status(201).json({

message:
"Timetable created successfully",


timetable

});



}

catch(error){


console.log(error);



if(error.code==="23505"){


return res.status(409).json({

message:
"Timetable already exists"

});


}



return res.status(500).json({

message:"Server Error"

});


}


};









export const fetchTeachersByClassSection =
async(req,res)=>{


try{


const {
class_id,
section_id
}
=req.params;



const teachers =
await getTeachersByClassSection(
class_id,
section_id
);



return res.status(200).json({

teachers

});


}

catch(error){


console.log(error);


return res.status(500).json({

message:"Server Error"

});


}


};









export const fetchSubjectsByTeacher =
async(req,res)=>{


try{


const {

teacher_number,

class_id,

section_id,

session_id

}=req.query;



const subjects =
await getSubjectsByTeacher(

teacher_number,

class_id,

section_id,

session_id

);



return res.status(200).json({

subjects

});


}
catch(error){


console.log(error);


return res.status(500).json({

message:"Server Error"

});


}


};









export const removeTimetable =
async(req,res)=>{


try{


const deleted =
await deleteTimetable(req.params.id);



if(!deleted){


return res.status(404).json({

message:"Timetable not found"

});


}



return res.status(200).json({

message:"Deleted successfully"

});


}
catch(error){


console.log(error);


return res.status(500).json({

message:"Server Error"

});


}


};