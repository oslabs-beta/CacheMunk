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

// load CacheMunk
const cache = CacheMunk(redis, {
  onCacheHit: ((queryKey, executionTime, dataLengthBytes) => {
    console.log(`***`);
    console.log(`cache hit on query ${queryKey} (${dataLengthBytes} bytes) in ${executionTime} ms. `);
  }),
  onCacheMiss: ((queryKey, executionTime) => {
    console.log(`***`);
    console.log(`cache miss on query ${queryKey} in ${executionTime} ms`);
  }),
  onWrite: ((queryKey, executionTime, originalSize, compressedSize) => {
    console.log(`***`);
    console.log(`wrote: ${compressedSize} bytes to cache at ${queryKey} in ${executionTime} ms`);
    console.log(`original size: ${originalSize} bytes`);
  })
});

console.log('cachemunk loaded');

// this is the SQL query
// const cities = await getAllPeople();

const serializedResult = "sometextcitiesretuls";
console.log(`Serialized length: ${serializedResult.length / 1000} kB`);

// set query result into the cache
await cache.set('people:select', serializedResult, ['people']);
await cache.set('testkey', 'testvalue', []);

// read from cache
await cache.get('people:select');
await cache.get('people:select2');

// when updating the cities table:
// await cache.invalidate('people');
