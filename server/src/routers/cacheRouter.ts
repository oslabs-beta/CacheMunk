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

//logic still needed for cached dynamic select
const getDynamicSelect = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const customQuery: string = (req.body as { query: string }).query;  
  queriesMap[customQuery] = customQuery;
  dependenciesMap[customQuery] = [];
  const result = await getData(customQuery);
  console.log('result:', result);
  res.locals.data = result;
  next();
});

router.get('/', getCities, (req: Request, res: Response) => {
  res.json(res.locals.data);
});

router.get('/costly', getCitiesCostly, (req: Request, res: Response) => {
  res.json(res.locals.data);
});

//dynamic select query router
//logic still needed for cached dynamic select
router.post('/dynamic-select', getDynamicSelect, (req: Request, res: Response) => {
  console.log('res.locals.data:', res.locals.data);
  res.json(res.locals.data);
});

export default router;
