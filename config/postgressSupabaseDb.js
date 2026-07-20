import pg from "pg";

const { Pool } = pg;

let pool;


const connectPostgressSupabaseDB = async () => {

    try {

        if (!process.env.DATABASE_URL) {
            throw new Error("DATABASE_URL not defined in .env");
        }


        pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false,
            },
        });


        await pool.query("SELECT NOW()");


        console.log("PostgreSQL Connected");


    } catch (error) {

        console.error(
            "PostgreSQL connection error:",
            error.message
        );

        process.exit(1);
    }

};


export const getPool = () => pool;
// now in model import it like this :- 
//import { getPool } from "../config/postgressSupabaseDb.js";

export default connectPostgressSupabaseDB;