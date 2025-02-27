import pgPromise from 'pg-promise';

const pgp = pgPromise();

const dbConfig = process.env.DB_URL
    ? {
        connectionString: process.env.DB_URL,
        ssl: {
            rejectUnauthorized: false,
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
