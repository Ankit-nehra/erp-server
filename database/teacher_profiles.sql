CREATE TABLE teacher_profiles (

    id SERIAL PRIMARY KEY,

    teacher_number VARCHAR(30) NOT NULL UNIQUE,

    teacher_name VARCHAR(150) NOT NULL,

    designation VARCHAR(100),

    qualification VARCHAR(100),

    profile_photo TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_teacher_profile
        FOREIGN KEY (teacher_number)
        REFERENCES teacherLogin(teacher_number)
        ON DELETE CASCADE

);