import { Router, Request, Response, NextFunction } from 'express';
import { SELECT_CITIES } from '../queries/queries.js';
import { query } from '../db.js';
import { asyncWrapper } from './errorHandling.js';
import { incrCacheMisses, addResponse } from '../server.js';

import cache from '../cache/redisClient.js';

const router = Router();

async function getCities (req: Request, res: Response, next: NextFunction) {

  if (res.locals.cached) {
    next()
    return;
  }

  const queryText = SELECT_CITIES;
  const queryKey = 'SELECT_CITIES';

  const [result, execTime] = await query(queryText);

  // Time querying from the database
  addResponse(execTime);
  incrCacheMisses();

  await cache.set(queryKey, JSON.stringify(result.rows), []);

  // eslint-disable-next-line require-atomic-updates
  res.locals.data = { query: queryText, rows: result.rows };
  next();
}

async function getCitiesWithCache (req: Request, res: Response, next: NextFunction) {

  const queryText = SELECT_CITIES;
  const queryKey = 'SELECT_CITIES';

  const cachedResult = await cache.get(queryKey);
  
  if (cachedResult) {
    res.locals.data = { query: queryText, rows: cachedResult };
    res.locals.cached = true;
  } else {
    res.locals.data = undefined;
    res.locals.cached = false;
  }
  next();
}

router.get('/', asyncWrapper(getCitiesWithCache), asyncWrapper(getCities), (req: Request, res: Response) => {
  res.json(res.locals.data);
});


export default router;