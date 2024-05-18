import { Router, Request, Response } from 'express';
import { cacheHits, cacheMisses } from '../server.js'; // Import the metrics
import pool from '../database.js'; // Import the database connection

const router = Router();
const cache = new Map<string, any>(); // Primitive cache using a Map

// router.get('/cache', (req: Request, res: Response) => {
//   // Simulate cache check
//   // check cache for query key
//   const isCacheHit = Math.random() > 0.5;
//   if (isCacheHit) {
//     cacheHits.inc();
//     // if true, send back result from cache
//     res.status(200).send('Read with Cache - Cache Hit!');
//   } else {
//     cacheMisses.inc();
//     // if false, directly query the SQL database
//     // send result to the cache (use async await)
//     // send the response to the front end (use async await)
//     res.status(200).send('Read with Cache - Cache Miss!');
//   }
// });

router.get('/cache', async (req: Request, res: Response) => {
  const queryKey = req.url; // Use the request URL as the cache key
  const query = 'SELECT * FROM public.films ORDER BY _id ASC LIMIT 100';

  if (cache.has(queryKey)) {
    cacheHits.inc(); // Increment cache hits metric
    return res.status(200).json(cache.get(queryKey)); // Return cached data
  }

  try {
    const client = await pool.connect();
    const result = await client.query(query);
    client.release();
    cache.set(queryKey, result.rows); // Cache the result
    cacheMisses.inc(); // Increment cache misses metric
    res.status(200).json(result.rows);
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error executing query', err.stack);
    } else {
      console.error('Unexpected error', err);
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/nocache', async (req: Request, res: Response) => {
  const query = 'SELECT * FROM public.films ORDER BY _id ASC LIMIT 100';

  try {
    const client = await pool.connect();
    const result = await client.query(query);
    client.release();

    res.status(200).json(result.rows);
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error executing query', err.stack);
    } else {
      console.error('Unexpected error', err);
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/cache-costly', (req: Request, res: Response) => {
  res.status(200).send('Read with Cache-Costly');
});

router.get('/nocache-costly', async (req: Request, res: Response) => {
  const query = `SELECT
  p.name AS character_name,
  s.name AS species_name,
  COUNT(DISTINCT f._id) AS number_of_films,
  ARRAY_AGG(DISTINCT f.title) AS films,
  pl.name AS homeworld
FROM
  people p
JOIN
  species s ON p.species_id = s._id
JOIN
  people_in_films pf ON p._id = pf.person_id
JOIN
  films f ON pf.film_id = f._id
JOIN
  planets pl ON p.homeworld_id = pl._id
GROUP BY
  p.name, s.name, pl.name
HAVING
  COUNT(DISTINCT f._id) > 1
ORDER BY
  number_of_films DESC;
`;

  try {
    const client = await pool.connect();
    const result = await client.query(query);
    client.release();

    res.status(200).json(result.rows);
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error executing query', err.stack);
    } else {
      console.error('Unexpected error', err);
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/cache', (req: Request, res: Response) => {
  // invalidate the cache based on specified dependencies
  // make insert query to the SQL database
  res.status(201).send('patch with cache');
});

router.post('/nocache', (req: Request, res: Response) => {
  res.status(201).send('patch without cache');
});

export default router;
