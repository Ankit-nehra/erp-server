CREATE TABLE student_profiles (

    id SERIAL PRIMARY KEY,

    admission_number VARCHAR(30) NOT NULL UNIQUE,

    student_name VARCHAR(150) NOT NULL,

    roll_number INTEGER,

    class_name VARCHAR(20),

    section VARCHAR(10),

    session VARCHAR(20),

    profile_photo TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_student_profile
        FOREIGN KEY (admission_number)
        REFERENCES studentLogin(admission_number)
        ON DELETE CASCADE

);