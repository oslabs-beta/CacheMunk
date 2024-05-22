import 'dotenv/config';
import { Redis } from 'ioredis';
import { configureCache } from './cache.js';
import { incrCacheMisses, incrCacheHits, addResponse } from '../server.js';

const {
  REDIS_HOST,
  REDIS_PORT,
} = process.env;

const redis = new Redis({ host: REDIS_HOST, port: REDIS_PORT ? parseInt(REDIS_PORT) : 6379 })

function onCacheHit (queryKey: string, execTime: number) {
  incrCacheHits();
  addResponse(execTime);
}

function onCacheMiss (queryKey: string, execTime: number) {
  incrCacheMisses();
  addResponse(execTime);
}

const cache = configureCache({ 
  redis,
  onCacheHit,
  onCacheMiss,
});

export default cache;