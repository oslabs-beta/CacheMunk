import 'dotenv/config';
import pg from 'pg';
const { Pool } = pg;

const {
  PG_HOST,
  PG_PORT,
  PG_USER,
  PG_PASSWORD,
  PG_DB,
} = process.env;

const pool = new Pool({
  user: PG_USER,
  host: PG_HOST,
  database: PG_DB,
  password: PG_PASSWORD,
  port: PG_PORT ? parseInt(PG_PORT) : 5432,
});

export const query = async (text: string, params?: (string | number | boolean)[]): Promise<pg.QueryResult> => {
  const result = await pool.query(text, params);

  // eslint-disable-next-line no-console
  console.log(`query ${text} executed`);
  return result;
};
