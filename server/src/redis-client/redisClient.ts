import 'dotenv/config';
import { Redis } from 'ioredis';

const { REDIS_HOST, REDIS_PORT } = process.env;

if (REDIS_HOST === undefined || REDIS_PORT === undefined) {
  console.error('Error reading from env file');
  process.exit(1);
}

const redis = new Redis({
  port: REDIS_PORT ? parseInt(REDIS_PORT) : 6379, // Redis port
  host: REDIS_HOST ?? '127.0.0.1', // Redis host
});

await redis.set('mykey', 'value');

redis
  .get('mykey')
  .then((result) => {
    console.log(result); // Prints "value"
  })
  .catch((err: unknown) => {
    console.error(err);
  });

await redis.set('key', 'data', 'EX', 60);
