import 'dotenv/config';
import { Redis } from 'ioredis';
import { configureCache } from './cache.js';

const { REDIS_HOST, REDIS_PORT } = process.env;

export const redis = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT ? parseInt(REDIS_PORT) : 6379,
  retryStrategy: (times) => {
    // Exponential backoff strategy
    // Returns the delay in milliseconds before a retry should be attempted
    if (times < 3) {
      return Math.min(times * 100, 2000); // Gradually increase the delay and cap at 2000ms
    }
    return null; // Stop retrying after the 10th attempt
  },
});

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
