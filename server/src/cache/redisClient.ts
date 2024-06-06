import 'dotenv/config';
import { Redis } from 'ioredis';
import { configureCache } from './cache.js';

export const redis = new Redis({ host: process.env.REDIS_HOST, port: 6379 });

redis.on('connect', () => {
  console.log('Connected to Redis');
});

redis.on('error', () => {
  console.log('Redis error');
  // Implement your error handling logic here
});

redis.on('reconnecting', (delay: number) => {
  console.log(`Reconnecting to Redis in ${delay.toString()}ms`);
});

redis.on('end', () => {
  console.log('Disconnected from Redis');
  // You can handle graceful shutdown or cleanup tasks here
});

export const cache = configureCache({
  redis,
});

export default cache;
