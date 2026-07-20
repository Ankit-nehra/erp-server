import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
//---------------------------- database -----------------------------------------
import connectDB from "./config/mongoDb.js";
import connectPostgressSupabaseDB from "./config/postgressSupabaseDb.js";
//--------------------------------- admin ----------------------------------------
import authRoutes from "./routes/admin/authRoutes.js";
import galleryRoutes from "./routes/admin/galleryRoutes.js";
import noticeRoutes from "./routes/admin/noticeRoutes.js";
import achievementRoutes from "./routes/admin/achievementRoutes.js";
import adminRoutes from "./routes/admin/adminRoutes.js"
import studentAdminRoutes from "./routes/admin/student.routes.js";
//------------------------------------- student --------------------------------
import StudentLogin from "./routes/student/studentLogin.js";
import studentProfileRoutes from "./routes/student/studentProfile.routes.js";
import studentAttendanceRoutes from "./routes/student/attendance.routes.js";
import studentMarks from "./routes/student/result.route.js"
import studentNoticeRoutes from "./routes/student/notice.routes.js";
import studentSyllabusRoute from "./routes/student/syllabus.route.js"
import studentTimetable from "./routes/student/timeTable.routes.js"
//--------------------------------------- teacher ---------------------------------
import TeacherLogin from "./routes/teacher/teacherLogin.js";
import teacherProfileRoutes from "./routes/teacher/teacherProfile.routes.js"
import teacherAttendanceRoutes from "./routes/teacher/attendance.routes.js";
import teacherStudentsRoutes from "./routes/teacher/students.routes.js";
import marksRoutes from "./routes/teacher/marks.routes.js";
import TeachernoticeRoutes from "./routes/teacher/notice.routes.js"
import syllabusRoutes from "./routes/teacher/syllabus.routes.js"
import TeacherTimetable from "./routes/teacher/timetable.routes.js"
//--------------------------------------- principal ---------------------------------
import PrincipalLogin from "./routes/principal/principalLogin.js";
import principalProfileRoutes from "./routes/principal/principalProfile.routes.js";
import principalStudentsRoutes from "./routes/principal/students.routes.js";
import PrincipalFetchstudentProfileRoutes from "./routes/principal/studentProfile.routes.js";



dotenv.config();
connectDB();
connectPostgressSupabaseDB();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());



//************************************************* Routes  *************************************

//----------------------------------- authRoute (admin) ----------------------------
app.use("/api/auth", authRoutes);

// adminPageRoutes
app.use("/api/gallery", galleryRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/admin/",adminRoutes);
app.use(
    "/api/admin/students",
    studentAdminRoutes
);
//------------------------------------- studentPageRoutes ---------------------------
 app.use("/api/studentLogin",StudentLogin);

app.use(
    "/api/student/profile",
    studentProfileRoutes
);

app.use(
    "/api/student/attendance",
    studentAttendanceRoutes
);
app.use(
    "/api/studentMarks",
    studentMarks
);
app.use(
    "/api/student/notices",
    studentNoticeRoutes
);
app.use(
"/api/student/syllabus",
studentSyllabusRoute
);

app.use(
"/api/student/timetable",
studentTimetable
);

//-------------------------------------------- teacherpageRoutes ----------------------------------
 app.use("/api/teacherLogin",TeacherLogin);
 app.use(
    "/api/teacher/profile",
    teacherProfileRoutes
);
app.use(
    "/api/teacher/attendance",
    teacherAttendanceRoutes
);
app.use(
    "/api/teacher/students",
    teacherStudentsRoutes
);
app.use(
    "/api/teacher/marks",
    marksRoutes
);
app.use(
    "/api/teacher/notices",
    TeachernoticeRoutes 
)
app.use(
    "/api/teacher/syllabus",
     syllabusRoutes);

     app.use(
    "/api/teacher",
     TeacherTimetable);


    
//--------------------------------------------- principalPageRoutes ------------------------
 app.use("/api/principalLogin",PrincipalLogin);
  app.use(
    "/api/principal",
    principalProfileRoutes
);

app.use(
    "/api/principal/students",
    principalStudentsRoutes
);

app.use(
    "/api/principal/student-profile",
    PrincipalFetchstudentProfileRoutes
);


// Default port fallback
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
