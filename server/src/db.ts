import dotenv from 'dotenv';
dotenv.config();
import pg from 'pg';
const { Pool } = pg;

// Destructure environment variables
const { PG_HOST, PG_PORT, PG_USER, PG_PASSWORD, PG_DB } = process.env;

// Validate required environment variables
const requiredEnvVars = ['PG_HOST', 'PG_PORT', 'PG_USER', 'PG_PASSWORD', 'PG_DB'];
requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});

// Create a new Pool instance
const pool = new Pool({
  user: PG_USER,
  host: PG_HOST,
  database: PG_DB,
  password: PG_PASSWORD,
  port: PG_PORT ? parseInt(PG_PORT) : 5432,
});

// Function to test the database connection on startup
void (async () => {
  try {
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    // eslint-disable-next-line no-console
    console.log('Database connected successfully');
    client.release();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error connecting to the database:', err);
  }
})();

// Export a query function
export const query = async (
  text: string,
  params?: (string | number | boolean)[],
): Promise<pg.QueryResult> => {
  try {
    const result = await pool.query(text, params);
    // eslint-disable-next-line no-console
    // console.log(`query ${text} executed`);
    return result;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`Error executing query ${text}:`, err);
    throw err; // Re-throw the error after logging it
  }
};
