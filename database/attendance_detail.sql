CREATE TABLE "attendance_detail"
(

    id SERIAL PRIMARY KEY,


    attendance_id INTEGER NOT NULL,


    student_number VARCHAR(50) NOT NULL,


    status VARCHAR(20) NOT NULL,


    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,


    CONSTRAINT fk_attendance_detail

    FOREIGN KEY(attendance_id)

    REFERENCES "attendance"(id)

    ON DELETE CASCADE,


    CONSTRAINT unique_student_attendance

    UNIQUE
    (
        attendance_id,
        student_number
    )

);