import CacheMunk from './cache.js';
import { redis } from './redisClient.js';
import { getAllPeople, getAllCities } from './db.js';
import msgpack from 'msgpack-lite';
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

// this is the SQL query
const cities = await getAllCities();

const serializedResult = JSON.stringify(cities);
console.log(`Serialized length: ${serializedResult.length / 1000} kB`);

// set query result into the cache
await cache.set('cities:select', serializedResult, ['cities', 'countries']);

// read from cache
await cache.get('cities:select');

// when updating the cities table:
await cache.invalidate('cities');
