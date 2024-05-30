import { Request, Response, NextFunction } from 'express';
import { asyncWrapper } from './errorHandling.js';
import cache from '../cache/redisClient.js';
import { query } from '../db.js';

export const dynamicQuery = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    //need custom insert location
    //need custom values to insert
    const queryExample = `INSERT INTO table_name (column1, column2, column3, ...)
    VALUES (value1, value2, value3, ...)`;

    const queryText = req.body.query;

    try {
      const result = await query(queryText, values);

      // invalidate cache here
      await cache.invalidate('cities');

      console.log(result);
    } catch (err) {
      console.log(err);
    }

    //This is an update test for dev

    next();
  },
);
