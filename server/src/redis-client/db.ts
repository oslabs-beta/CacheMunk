import pg from 'pg';
const { Pool } = pg;
import 'dotenv/config';
import {
  SELECT_ALL_PEOPLE,
  SELECT_CITIES,
} from './queries.js';
import { logger } from './logger.js';

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

export const getAllCities = async () => {
  const client = await pool.connect();
  const t0 = process.hrtime.bigint();

  const res = await client.query(SELECT_CITIES);
  const rows = res.rows;

  const t1 = process.hrtime.bigint();

  client.release();

  void logger('getAllCities', t0, t1);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return rows;
};

export const getAllPeople = async () => {
  const client = await pool.connect();
  const t0 = process.hrtime.bigint();

  const res = await client.query(SELECT_ALL_PEOPLE);
  const rows = res.rows;

  const t1 = process.hrtime.bigint();

  client.release();

  void logger('getAllPeople', t0, t1);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return rows;
};
