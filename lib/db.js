import pgPromise from 'pg-promise';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize pg-promise
const pgp = pgPromise();

// Define connection configuration
const dbConfig = process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL, // Use the full DATABASE_URL if available
        ssl: {
            rejectUnauthorized: false, // This is often needed for cloud-hosted databases like Render
        },
    }
    : {
        host: process.env.PG_HOST,
        port: process.env.PG_PORT,
        database: process.env.PG_DATABASE,
        user: process.env.PG_USER,
        password: process.env.PG_PASSWORD,
    };

// Initialize the database connection
const db = pgp(dbConfig);

export default db;
