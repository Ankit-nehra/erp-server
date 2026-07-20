CREATE TABLE studentsLogin (
    id SERIAL PRIMARY KEY,

    admission_number VARCHAR(50) UNIQUE NOT NULL,

    password VARCHAR(255) NOT NULL
);