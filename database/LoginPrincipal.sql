CREATE TABLE principalsLogin (
    id SERIAL PRIMARY KEY,

    principal_number VARCHAR(50) UNIQUE NOT NULL,

    password VARCHAR(255) NOT NULL
);