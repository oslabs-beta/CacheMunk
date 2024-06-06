import { Router, Request, Response, NextFunction } from 'express';
import { asyncWrapper } from '../controllers/errorHandling.js';
import { getData } from '../controllers/cachingController.js';
import { queriesMap, dependenciesMap } from '../queries/queriesMap.js';

const router = Router();

const getCities = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const queryKey = 'SELECT_CITIES';
  const result = await getData(queryKey);
  res.locals.data = result;
  next();
});

const getCitiesCostly = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const queryKey = 'SELECT_CITIES_COSTLY';
  const result = await getData(queryKey);
  res.locals.data = result;
  next();
});

const getDynamicSelect = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const customQuery: string = (req.body as { query: string }).query;
  queriesMap[customQuery] = customQuery;
  const tableName: string | null = extractTableName(customQuery);
  if (tableName) {
    dependenciesMap[customQuery] = [tableName];
  } else {
    dependenciesMap[customQuery] = [];
  }
  const result = await getData(customQuery);
  // console.log('result:', result);
  console.log('dependenciesMap:', dependenciesMap);
  res.locals.data = result;
  next();
});

function extractTableName(query: string): string | null {
  // Define the regex pattern to match the table name
  const regex = /from\s+([a-zA-Z_][a-zA-Z0-9_]*)/i;

  // Execute the regex on the query
  const match = query.match(regex);

  // If a match is found, return the table name, otherwise return null
  return match ? match[1] : null;
}

router.get('/', getCities, (req: Request, res: Response) => {
  res.json(res.locals.data);
});

router.get('/costly', getCitiesCostly, (req: Request, res: Response) => {
  res.json(res.locals.data);
});

//dynamic select query router
//logic still needed for cached dynamic select
router.post('/dynamic-select', getDynamicSelect, (req: Request, res: Response) => {
  // console.log('res.locals.data:', res.locals.data);
  res.json(res.locals.data);
});

export default router;
