import { Router, Request, Response } from 'express';
import { cacheHits, cacheMisses } from '../server.js'; // Import the metrics

const router = Router();

router.get('/cache', (req: Request, res: Response) => {
  // Simulate cache check
  // check cache for query key
  const isCacheHit = Math.random() > 0.5;
  if (isCacheHit) {
    cacheHits.inc();
    // if true, send back result from cache
    res.status(200).send('Read with Cache - Cache Hit!');
  } else {
    cacheMisses.inc();
    // if false, directly query the SQL database
    // send result to the cache (use async await)
    // send the response to the front end (use async await)
    res.status(200).send('Read with Cache - Cache Miss!');
  }
});

router.get('/nocache', (req: Request, res: Response) => {
  res.status(200).send('read without cache');
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
