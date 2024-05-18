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
const cities = await getAllPeople();

const serializedResult = JSON.stringify(cities);
console.log(`Serialized length: ${serializedResult.length / 1000} kB`);

// set query result into the cache
await cache.set('people:select', serializedResult, ['people']);
await cache.set('testkey', 'testvalue', []);

// read from cache
await cache.get('people:select');

// when updating the cities table:
// await cache.invalidate('people');
