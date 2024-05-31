import { Router, Request, Response } from 'express';
import cacheRouter from './cacheRouter.js';
import noCacheRouter from './no-cacheRouter.js';
import { insertCity } from '../controllers/insertCity.js';
import { dynamicQuery } from '../controllers/dynamicController.js';

const router = Router();

router.use('/cache', cacheRouter);

router.use('/no-cache', noCacheRouter);

router.post('/cities', insertCity, (req: Request, res: Response) => {
  // invalidate the cache based on specified dependencies
  // make insert query to the SQL database
  res.status(201).json({ message: 'city inserted in db' });
});

router.post('/dynamic-insert', dynamicQuery, (req: Request, res: Response) => {
  // invalidate the cache
  // make insert query ot the SQL database
  res.status(201).json({ message: 'db insertion complete' });
});

export default router;
