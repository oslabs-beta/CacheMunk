import pkg from 'pg';
const { Pool } = pkg;

// // if using AWS
// const pool = new Pool({
//   user: 'postgres',
//   host: 'starwarsdatabase.ctgquiggmhnk.us-east-1.rds.amazonaws.com',
//   database: 'starwars',
//   password: 'cachemunk',
//   port: 5432, // default PostgreSQL port
//   ssl: {
//     rejectUnauthorized: false, // This is not recommended for production; see below for better handling
//   },
// });

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'cities',
  password: 'mypassword',
  port: 5432,
});

export default pool;
