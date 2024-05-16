import CacheMunk from './cache.js';
import { redis } from './redisClient.js';
import { getAllPeople, getAllCities } from './db.js';
console.log('cachemunk loading');

const waitForRedis = async () =>
  new Promise((resolve) => {
    redis.on('ready', () => {
      resolve('Redis ready');
    });
  });

await waitForRedis();

const cache = CacheMunk(redis);
console.log('cachemunk loaded');
const cities = await getAllCities();

const cities2 = await getAllCities();
const cities3 = await getAllCities();

const serializedResult = JSON.stringify(cities);
console.log(`Serialized length: ${serializedResult.length / 1000} kB`);

await cache.cacheQueryResult('cities:select', serializedResult, ['cities', 'countries']);

await cache.cacheQueryResult('cities:selectAll', serializedResult, ['cities', 'countries']);

await cache.getCachedQueryResult('cities:select');

await cache.getCachedQueryResult('cities:selectAll');

await cache.getCachedQueryResult('cities:select');

// await cache.invalidateCache('people');
