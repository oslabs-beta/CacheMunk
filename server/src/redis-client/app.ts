import CacheMunk from './cache.js';
import { redis } from './redisClient.js';

const waitForRedis = async () =>
  new Promise((resolve) => {
    redis.on('ready', () => {
      resolve('Redis ready');
    });
  });

await waitForRedis();

const cache = CacheMunk(redis);

await cache.cacheQueryResult('key', 'value', ['b']);
