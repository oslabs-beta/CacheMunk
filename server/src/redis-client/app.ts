import CacheMunk from './cache.js';
import { redis } from './redisClient.js';
import { getAllPeople } from './db.js';
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
const people = await getAllPeople();

await getAllPeople();
console.log(people.length);

const serializedData = JSON.stringify(people);

await cache.cacheQueryResult('people:select', serializedData, ['people']);

await cache.cacheQueryResult('people:selectAll', serializedData, ['people']);

await cache.getCachedQueryResult('people:select');

await cache.getCachedQueryResult('people:selectAll');

// await cache.invalidateCache('people');
