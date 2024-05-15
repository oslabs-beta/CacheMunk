import pg from 'pg';
const { Pool } = pg;
import 'dotenv/config';
import { performance } from 'perf_hooks';
import { SELECT_ALL_PEOPLE } from './queries.js';

const { PG_HOST, PG_PORT, PG_USER, PG_PASSWORD, PG_DB } = process.env;

export const pool = new Pool({
  host: PG_HOST,
  user: PG_USER,
  port: PG_PORT ? parseInt(PG_PORT) : 5432,
  password: PG_PASSWORD,
  database: PG_DB,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 2,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const getAllPeople = async () => {
  const client = await pool.connect();
  const t0 = performance.now();

  const res = await client.query(`${SELECT_ALL_PEOPLE}`);

  const t1 = performance.now();

  client.release();

  console.log(`response took ${t1 - t0} ms with ${res.rows.length} rows`);
  return res.rows;
};
