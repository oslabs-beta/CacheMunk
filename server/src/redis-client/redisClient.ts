import 'dotenv/config';
import { Redis } from 'ioredis';

const { REDIS_HOST, REDIS_PORT } = process.env;

export const redis = new Redis({
  port: REDIS_PORT ? parseInt(REDIS_PORT, 10) : 6379, // Redis port
  host: REDIS_HOST ?? '127.0.0.1', // Redis host
});

// Handle connection errors
redis.on('error', (err: Error) => {
  console.error('Redis connection error:', err);
});

// Handle reconnection attempts
redis.on('reconnecting', (time: number) => {
  console.warn(`Redis client attempting to reconnect in ${time.toString()}ms`);
});

// Handle successful connection
redis.on('ready', () => {
  console.log('Redis client connected and ready');
});

// Handle end event when connection is closed
redis.on('end', () => {
  console.log('Redis connection closed');
});

// Handle warning events
redis.on('warning', (warning: string) => {
  console.warn('Redis warning:', warning);
});
