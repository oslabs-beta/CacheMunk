import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  host: 'starwarsdatabase.ctgquiggmhnk.us-east-1.rds.amazonaws.com',
  database: 'starwars',
  password: 'cachemunk',
  port: 5432, // default PostgreSQL port
  ssl: {
    rejectUnauthorized: false, // This is not recommended for production; see below for better handling
  },
});

export default pool;
