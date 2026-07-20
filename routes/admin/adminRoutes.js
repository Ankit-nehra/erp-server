import express from "express";
import {
    fetchAllSessions,
    fetchSessionById,
    addSession,
    removeSession,
} from "../../controllers/admin/sessions.controller.js";

import{
    fetchClasses,
    addClass,
    removeClass
} from "../../controllers/admin/class.controller.js"

import{
    fetchPeriods,
    addPeriod,
    removePeriod
}
from "../../controllers/admin/period.controller.js";

import{
    fetchSections,
    addSection,
    removeSection
} from "../../controllers/admin/section.controller.js"

import{
    fetchSubjects,
    addSubject,
    removeSubject
} from "../../controllers/admin/subject.controller.js"

import {
fetchTeacherAssignedClasses,
assignTeacherClass,
removeTeacherAssignment
}
from "../../controllers/admin/teacherAssignedClass.controller.js";

import {

    fetchClassSectionSubjectMappings,
    fetchSectionsByClass,
    fetchSubjectsByClassAndSection,
    addClassSectionSubjectMapping,
    removeClassSectionSubjectMapping

} from "../../controllers/admin/classSectionSubjectMapping.controller.js";

import {

fetchTimetable,
addTimetable,
removeTimetable,
fetchTeachersByClassSection,
fetchSubjectsByTeacher

}
from "../../controllers/admin/timetable.controller.js";

    

const router = express.Router();

router.get("/sessions", fetchAllSessions);

router.get("/sessions/:id", fetchSessionById);

router.post("/sessions", addSession);

router.delete("/sessions/:id", removeSession);

router.get("/classes",fetchClasses);
router.post("/classes",addClass);
router.delete( "/classes/:id",removeClass);

router.get("/periods",fetchPeriods);

router.post("/periods",addPeriod);

router.delete("/periods/:id",removePeriod);


router.get("/sections",fetchSections);
router.post("/sections",addSection);
router.delete("/sections/:id", removeSection);

router.get("/subjects",fetchSubjects);
router.post("/subjects",addSubject);
router.delete("/subjects/:id",removeSubject);

router.get("/teacher-assigned-class",fetchTeacherAssignedClasses);
router.post("/teacher-assigned-class",assignTeacherClass);
router.delete("/teacher-assigned-class/:id",removeTeacherAssignment);

router.get("/class-section-subject",fetchClassSectionSubjectMappings);
router.get("/class-section-subject/sections/:class_id",fetchSectionsByClass);
router.get("/class-section-subject/subjects/:class_id/:section_id",fetchSubjectsByClassAndSection);
router.post("/class-section-subject",addClassSectionSubjectMapping);
router.delete("/class-section-subject/:id",removeClassSectionSubjectMapping);
// ================= TIMETABLE =================


// Get complete timetable
router.get("/timetable",fetchTimetable);
// Create timetable
router.post("/timetable",addTimetable);
// Delete timetable
router.delete("/timetable/:id",removeTimetable);
// Get teachers according to class + section
router.get("/timetable/teachers/:class_id/:section_id",fetchTeachersByClassSection);
// Get subjects according to teacher + class + section + session
router.get("/timetable/subjects",fetchSubjectsByTeacher);






// router.post("/createStudent",)

export default router;