import CacheMunk from './cache.js';
import { Redis } from 'ioredis';

const redis = new Redis({ port: 6379, host: '127.0.0.1' });

// load CacheMunk
const cache = CacheMunk(redis, {
  onCacheHit: (queryKey, executionTime, dataLengthBytes) => {
    console.log(
      `cache hit on query ${queryKey} (${dataLengthBytes.toString()} bytes) in ${executionTime.toString()} ms. `,
    );
  },
  onCacheMiss: (queryKey, executionTime) => {
    console.log(`cache miss on query ${queryKey} in ${executionTime.toString()} ms`);
  },
  onWrite: (queryKey, executionTime, originalSize, compressedSize) => {
    console.log(
      `wrote: ${compressedSize.toString()} bytes to cache at ${queryKey} in ${executionTime.toString()} ms`,
    );
    console.log(`original size: ${originalSize.toString()} bytes`);
  },
});

console.log('cachemunk loaded');

const serializedResult = 'someresult';

// set query result into the cache
await cache.set('people:select', serializedResult, ['people']);
await cache.set('testkey', 'testvalue', []);

// read from cache
await cache.get('people:select');
await cache.get('people:select2');

// Read from cache and log the result
const result1 = await cache.get('people:select');
console.log('Result for people:select:', result1);

const result2 = await cache.get('testkey');
console.log('Result for people:select2:', result2);

// when updating the cities table:
// await cache.invalidate('people');
