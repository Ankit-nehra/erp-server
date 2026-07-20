CREATE TABLE "attendance"
(

    id SERIAL PRIMARY KEY,


    session_id INTEGER NOT NULL,

    class_id INTEGER NOT NULL,

    section_id INTEGER NOT NULL,


    subject_id INTEGER NOT NULL,


    teacher_number VARCHAR(50) NOT NULL,


    attendance_date DATE NOT NULL,


    period_number INTEGER NOT NULL,


    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,



    CONSTRAINT fk_attendance_session

    FOREIGN KEY(session_id)

    REFERENCES "sessions"(id),



    CONSTRAINT fk_attendance_class

    FOREIGN KEY(class_id)

    REFERENCES classes(id),



    CONSTRAINT fk_attendance_section

    FOREIGN KEY(section_id)

    REFERENCES "sections"(id),



    CONSTRAINT fk_attendance_subject

    FOREIGN KEY(subject_id)

    REFERENCES subjects(id),



    CONSTRAINT fk_attendance_teacher

    FOREIGN KEY(teacher_number)

    REFERENCES "teachersLogin"(teacher_number),



    CONSTRAINT unique_attendance

    UNIQUE
    (
        session_id,
        class_id,
        section_id,
        subject_id,
        teacher_number,
        attendance_date,
        period_number
    )

);