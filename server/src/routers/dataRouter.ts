import { Router, Request, Response } from 'express';
import cacheRouter from './cacheRouter.js';
import noCacheRouter from './no-cacheRouter.js';

const router = Router();

router.use('/cache', cacheRouter);

router.use('/no-cache', noCacheRouter);

router.post('/cities', (req: Request, res: Response) => {
  // invalidate the cache based on specified dependencies
  // make insert query to the SQL database
  res.status(201).send('Getting Cities Back');
});

export default router;
