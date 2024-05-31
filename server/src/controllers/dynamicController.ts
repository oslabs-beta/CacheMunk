import { Request, Response, NextFunction } from 'express';
import { asyncWrapper } from './errorHandling.js';
import cache from '../cache/redisClient.js';
import { query } from '../db.js';

//Req is an object with custom name and state id - sending other values as well

export const dynamicQuery = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    //need custom insert name
    //need custom values to insert
    // const req.body = {
    //   "name": "",
    //   "state_code": "ID",
    //   "country_id": 233,
    //   "country_code": "US",
    //   "latitude": "38.842460",
    //   "longitude": "-84.021296",
    //   "flag": true,
    //   "state_id": 1460
    // }

    const { name, state_code, country_id, country_code, latitude, longitude, flag, state_id } =
      req.body;

    const queryText = `INSERT INTO cities (
      name, state_code, country_id, country_code, latitude, longitude, flag, state_id
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8
    )
    `;

    const values = [
      name,
      state_code,
      country_id,
      country_code,
      latitude,
      longitude,
      flag,
      state_id,
    ];

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
