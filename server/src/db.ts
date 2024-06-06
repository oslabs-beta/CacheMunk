import 'dotenv/config';
import pg from 'pg';
const { Pool } = pg;

// Destructure environment variables
const { PG_HOST, PG_PORT, PG_USER, PG_PASSWORD, PG_DB } = process.env;

// Validate required environment variables
const requiredEnvVars = ['PG_HOST', 'PG_PORT', 'PG_USER', 'PG_PASSWORD', 'PG_DB'];
requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    console.log(`Missing required environment variable: ${varName}`);
  }
});

// Create a new Pool instance
export const pool = new Pool({
  user: PG_USER,
  host: PG_HOST,
  database: PG_DB,
  password: PG_PASSWORD,
  port: PG_PORT ? parseInt(PG_PORT) : 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Export a query function
export const query = async (
  text: string,
  params?: (string | number | boolean)[],
): Promise<pg.QueryResult | undefined> => {
  try {
    const result = await pool.query(text, params);
    // eslint-disable-next-line no-console
    // console.log(`query ${text} executed`);
    return result;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`Error executing query ${text.slice(0, 20)}:`, err);
  }
};
