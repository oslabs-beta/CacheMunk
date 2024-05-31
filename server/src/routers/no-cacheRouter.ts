import { Router, Request, Response, NextFunction } from 'express';
import { SELECT_CITIES, SELECT_CITIES_COSTLY } from '../queries/queries.js';
import { query } from '../db.js';
import { asyncWrapper } from '../controllers/errorHandling.js';
import { incrCacheMisses, addResponse } from '../analytics.js';

const router = Router();

const calcExecTime = (start: bigint, end: bigint) => Number(end - start) / 1_000_000;

const getCities = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const queryText = SELECT_CITIES;
  const t0 = process.hrtime.bigint();
  const result = await query(queryText);
  const t1 = process.hrtime.bigint();

  addResponse(calcExecTime(t0, t1));
  incrCacheMisses();

  res.locals.data = { query: queryText, rows: result.rows };
  next();
});

const getCitiesCostly = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const queryText = SELECT_CITIES_COSTLY;
  const t0 = process.hrtime.bigint();
  const result = await query(queryText);
  const t1 = process.hrtime.bigint();

  addResponse(calcExecTime(t0, t1));
  incrCacheMisses();

  res.locals.data = { query: queryText, rows: result.rows };
  next();
});

const getDynamicSelect = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const queryText = req.body.query;
  const t0 = process.hrtime.bigint();
  const result = await query(queryText);
  const t1 = process.hrtime.bigint();

  addResponse(calcExecTime(t0, t1));
  incrCacheMisses();

  res.locals.data = { query: queryText, rows: result.rows };
  next();
});

router.get('/', getCities, (req: Request, res: Response) => {
  res.json(res.locals.data);
});

router.get('/costly', getCitiesCostly, (req: Request, res: Response) => {
  res.json(res.locals.data);
});

//dynamic select query router
router.post('/dynamic-select', getDynamicSelect, (req: Request, res: Response) => {
  console.log('dynamic router');
  res.json(res.locals.data);
});

export default router;
