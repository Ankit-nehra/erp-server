CREATE TABLE "teacherAsignedClass" (

 id SERIAL PRIMARY KEY,

 teacher_number VARCHAR(30),

 class_id INTEGER,

 section_id INTEGER,

 subject_id INTEGER,

 session_id INTEGER,

 FOREIGN KEY (teacher_number)
 REFERENCES "teachersLogin"(teacher_number),

 FOREIGN KEY (class_id)
 REFERENCES "classes"(id),

 FOREIGN KEY (section_id)
 REFERENCES "sections"(id),

 FOREIGN KEY (subject_id)
 REFERENCES "subjects"(id),

 FOREIGN KEY (session_id)
 REFERENCES "sessions"(id)

);