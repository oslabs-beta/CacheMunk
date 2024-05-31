import { Request, Response, NextFunction } from 'express';
import cache from '../cache/redisClient.js';
import { asyncWrapper } from './errorHandling.js';
import { resetResponse, resetCache } from '../analytics.js';

export const deleteCache = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
  await cache.clear();
  resetResponse();
  resetCache();
  next();
});
