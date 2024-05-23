import { Router, Request, Response } from 'express';
import cacheRouter from './cacheRouter.js';
import noCacheRouter from './no-cacheRouter.js';
import { insertCity } from './insertCity.js';

const router = Router();

router.use('/cache', cacheRouter);

router.use('/no-cache', noCacheRouter);

router.post('/cities', insertCity, (req: Request, res: Response) => {
  // invalidate the cache based on specified dependencies
  // make insert query to the SQL database
  res.status(201).send('city inserted in db?');
});

export default router;
