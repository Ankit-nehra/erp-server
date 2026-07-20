import {
    getActiveSession,
    getTeacherAssignments,
    verifyTeacherAssignment,
    getStudents,
    getAttendance,
    getAttendanceDetails,
    createAttendanceRecord,
    createAttendanceDetails,
    deleteAttendanceRecord
} from "../../models/teacher/attendance.model.js";

import { getPool } from "../../config/postgressSupabaseDb.js";



/*
|--------------------------------------------------------------------------
| Attendance Options
|--------------------------------------------------------------------------
*/

const getAttendanceOptions = async (req,res)=>{

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



        return res.status(200).json({

            success:true,

            session:session,

            data:assignments

        });


    }
    catch(error){

        console.log(
            "Attendance options error:",
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
| Get Students
|--------------------------------------------------------------------------
*/

const getAttendanceStudents = async(req,res)=>{


try{


const teacherNumber =
req.user.teacherNumber;



const {

    class_id,
    section_id,
    subject_id,
    attendance_date,
    period_number

}=req.query;



if(
!class_id ||
!section_id ||
!subject_id ||
!attendance_date ||
!period_number
){

return res.status(400).json({

success:false,

message:"Required fields missing"

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




// teacher permission check

const assigned =
await verifyTeacherAssignment({

teacherNumber,

sessionId:session.id,

classId:class_id,

sectionId:section_id,

subjectId:subject_id

});




if(!assigned){

return res.status(403).json({

success:false,

message:"You are not assigned to this class"

});

}







// already attendance check

const attendance =
await getAttendance({

sessionId:session.id,

classId:class_id,

sectionId:section_id,

subjectId:subject_id,

attendanceDate:attendance_date,

periodNumber:period_number

});






if(attendance){


const details =
await getAttendanceDetails(
attendance.id
);



return res.status(200).json({

success:true,

alreadySubmitted:true,

attendance_id:attendance.id,

students:details

});


}

console.log(
"Fetching Students:",
{

session:
session.session_name,

class_id,

section_id

}

);






// new attendance

const students =
await getStudents({

sessionName:session.session_name,

classId:class_id,

sectionId:section_id

});




console.log(
"Students Found:",
students
);


const formattedStudents =
students.map(student=>({

...student,

status:"Present"

}));





return res.status(200).json({

success:true,

alreadySubmitted:false,

students:formattedStudents

});



}
catch(error){


console.log(
"Get attendance students error:",
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
| Create Attendance
|--------------------------------------------------------------------------
*/

const createAttendance = async(req,res)=>{


const pool =
getPool();


const client =
await pool.connect();



try{


const teacherNumber =
req.user.teacherNumber;



const {

class_id,
section_id,
subject_id,
attendance_date,
period_number,
students

}=req.body;




if(
!class_id ||
!section_id ||
!subject_id ||
!attendance_date ||
!period_number ||
!students ||
students.length===0
){

return res.status(400).json({

success:false,

message:"Invalid data"

});

}






const session =
await getActiveSession();



const assigned =
await verifyTeacherAssignment({

teacherNumber,

sessionId:session.id,

classId:class_id,

sectionId:section_id,

subjectId:subject_id

});




if(!assigned){

return res.status(403).json({

success:false,

message:"Not assigned"

});

}





await client.query("BEGIN");





const attendance =
await createAttendanceRecord(

client,

{

sessionId:session.id,

classId:class_id,

sectionId:section_id,

subjectId:subject_id,

teacherNumber,

attendanceDate:attendance_date,

periodNumber:period_number

}

);






await createAttendanceDetails(

client,

attendance.id,

students

);





await client.query("COMMIT");




return res.status(201).json({

success:true,

message:"Attendance submitted successfully",

attendance_id:attendance.id

});



}
catch(error){


await client.query("ROLLBACK");


console.log(
"Create attendance error:",
error
);


return res.status(500).json({

success:false,

message:"Server error"

});


}
finally{

client.release();

}


};







/*
|--------------------------------------------------------------------------
| Delete Attendance
|--------------------------------------------------------------------------
*/

const deleteAttendance = async(req,res)=>{


try{


const teacherNumber =
req.user.teacherNumber;



const {
attendanceId
}=req.params;




const deleted =
await deleteAttendanceRecord(

attendanceId,

teacherNumber

);




if(!deleted){

return res.status(404).json({

success:false,

message:
"Attendance not found or unauthorized"

});

}




return res.status(200).json({

success:true,

message:
"Attendance deleted successfully"

});



}
catch(error){


console.log(
"Delete attendance error:",
error
);


return res.status(500).json({

success:false,

message:"Server error"

});


}


};





export {

getAttendanceOptions,

getAttendanceStudents,

createAttendance,

deleteAttendance

};