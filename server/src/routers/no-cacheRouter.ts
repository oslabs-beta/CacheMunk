import { Router, Request, Response, NextFunction } from 'express';
import { SELECT_CITIES } from '../queries/queries.js';
import { query } from '../db.js';
import { asyncWrapper } from './errorHandling.js';
import { incrCacheMisses, addResponse } from '../server.js';

const router = Router();


async function getCities (req: Request, res: Response, next: NextFunction) {
  const queryText = SELECT_CITIES;

  const [result, execTime] = await query(queryText);

  addResponse(execTime);
  incrCacheMisses();

  res.locals.data = { query: queryText, rows: result.rows };
  next();
}

router.get('/', asyncWrapper(getCities), (req: Request, res: Response) => {
  res.json(res.locals.data);
});

export default router;