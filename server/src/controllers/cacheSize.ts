import { Request, Response, NextFunction } from 'express';
import cache from '../cache/redisClient.js';
import { asyncWrapper } from './errorHandling.js';

export const getCacheSize = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await cache.getSize();
    res.locals.cacheSize = result
    next();
  },
);

export const getStringKeySize = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await cache.getStringKeySize();
    res.locals.cacheSize = result
    next();
  },
);