import { queriesMap, dependenciesMap } from '../queries/queriesMap.js';
import { query } from '../db.js';
import type pg from 'pg';

import { incrCacheHits, incrCacheMisses, addResponse } from '../analytics.js';
import cache from '../cache/redisClient.js';

export const getData = async (queryKey: string): Promise<{ query: string, rows: pg.QueryResultRow}> => {
  const calcExecTime = (start: bigint, end: bigint) => Number(end - start) / 1_000_000;
  
  const t0 = process.hrtime.bigint();

  const queryText = queriesMap[queryKey];
  const cachedResult = await cache.get(queryKey);

  if (cachedResult) {
    const t1 = process.hrtime.bigint();
    incrCacheHits(); // incr cache hit counter
    addResponse(calcExecTime(t0, t1)); // add execution time to array
    return {
      query: queryText,
      rows: JSON.parse(cachedResult) as pg.QueryResultRow
    };
  }

  // if the result is not cached, we need to query the DB
  const result = await query(queryText);

  const queryDependencies: string[] = [];
  dependenciesMap[queryKey].forEach((dep) => queryDependencies.push(dep))
  
  await cache.set(queryKey, JSON.stringify(result.rows), queryDependencies);

  const t1 = process.hrtime.bigint()

  // Time from cache miss and time querying from database
  addResponse(calcExecTime(t0, t1));
  incrCacheMisses();

  return { query: queryText, rows: result.rows };
}