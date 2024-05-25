import { Request, Response, NextFunction } from 'express';
import { asyncWrapper } from './errorHandling.js';
import cache from '../cache/redisClient.js';
import { query } from '../db.js';

export const insertCity = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const city = {
    name: 'Aalphabet City',
    state_id: 1452,
    state_code: 'NY',
    country_id: 233,
    country_code: 'US',
    latitude: '43.80923000',
    longitude: '-76.02409000',
    created_at: '2019-10-06T01:01:43.000Z',
    updated_at: '2019-10-06T01:01:43.000Z',
    flag: true,
    wikidataid: 'Q2417063',
  };

  const queryText = `
  INSERT INTO cities (
    name, state_id, state_code, country_id, country_code, latitude, longitude,
    created_at, updated_at, flag, wikidataid
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
  )
  `;

  const values = [
    city.name,
    city.state_id,
    city.state_code,
    city.country_id,
    city.country_code,
    city.latitude,
    city.longitude,
    city.created_at,
    city.updated_at,
    city.flag,
    city.wikidataid,
  ];

  try {
    const result = await query(queryText, values);

    // invalidate cache here
    await cache.invalidate('cities');

    console.log(result);
  } catch (err) {
    console.log(err);
  }

  next();
});
