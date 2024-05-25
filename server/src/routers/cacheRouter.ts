import { Router, Request, Response, NextFunction } from 'express';
import { asyncWrapper } from '../controllers/errorHandling.js';
import { getData } from '../controllers/cachingController.js';

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

router.get('/', getCities, (req: Request, res: Response) => {
  res.json(res.locals.data);
});

router.get('/costly', getCitiesCostly, (req: Request, res: Response) => {
  res.json(res.locals.data);
});

export default router;
