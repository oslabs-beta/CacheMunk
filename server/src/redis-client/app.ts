import CacheMunk from './cache.js';
import { redis } from './redisClient.js';
import { getAllPeople } from './db.js';

const waitForRedis = async () =>
  new Promise((resolve) => {
    redis.on('ready', () => {
      resolve('Redis ready');
    });
  });

await waitForRedis();

const cache = CacheMunk(redis);

const people = await getAllPeople();

await getAllPeople();
console.log(people.length);
const payload = JSON.stringify(people);

await cache.cacheQueryResult('people:select', payload, ['people']);

await cache.getCachedQueryResult('people:select');

await cache.getCachedQueryResult('people:select');

await cache.invalidateCache('people');
