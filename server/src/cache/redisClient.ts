import 'dotenv/config';
import { Redis } from 'ioredis';
import { configureCache } from './cache.js';

const { REDIS_HOST, REDIS_PORT } = process.env;

const redis = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT ? parseInt(REDIS_PORT) : 6379,
});

const cache = configureCache({
  redis,
});

export default cache;
