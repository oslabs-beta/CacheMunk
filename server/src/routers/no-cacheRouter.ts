import { Router, Request, Response, NextFunction } from 'express';
import { SELECT_CITIES } from '../queries/queries.js';
import { query } from '../db.js';
import { asyncWrapper } from './errorHandling.js';
import { incrCacheMisses, addResponse } from '../analytics.js';

const router = Router();


async function getCities (req: Request, res: Response, next: NextFunction) {

  const calcExecTime = (start: bigint, end: bigint) => Number(end - start) / 1_000_000;
  
  const queryText = SELECT_CITIES;
  
  const t0 = process.hrtime.bigint()
  const result = await query(queryText);
  const t1 = process.hrtime.bigint()

  addResponse(calcExecTime(t0, t1));
  incrCacheMisses();

  res.locals.data = { query: queryText, rows: result.rows };
  next();
}

router.get('/', asyncWrapper(getCities), (req: Request, res: Response) => {
  res.json(res.locals.data);
});

export default router;