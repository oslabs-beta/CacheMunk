import { Redis } from 'ioredis';
import { logger } from './logger.js';
import { compressSync, uncompressSync } from 'snappy';

const CacheMunk = (redisClient: Redis) => {
  if (!(redisClient instanceof Redis)) {
    throw new Error('redisClient must be an ioredis client');
  }

  // Function to cache a query result
  async function cacheQueryResult(
    queryKey: string,
    result: string,
    dependencies: string[],
    ttlInSeconds = 60, // default to 1 hour in seconds
    compress = true,
  ) {
    const t0 = process.hrtime.bigint();

    // console.log(`result length: ${result.length}`);
    const beforeCompression = process.hrtime.bigint();
    const compressedResult = compress ? compressSync(Buffer.from(result)) : result;
    const afterCompression = process.hrtime.bigint();

    // console.log(`compressed length: ${compressedResult.length}`);

    if (dependencies.length > 0) {
      // Create a pipeline
      const pipeline = redisClient.pipeline();

      // Store the query result
      pipeline.set(queryKey, compressedResult, 'EX', ttlInSeconds);

      // Track dependencies
      dependencies.forEach((dep) => {
        const dependencyKey = `dependency:${dep}`;
        pipeline.sadd(dependencyKey, queryKey);
        pipeline.expire(dependencyKey, ttlInSeconds); // Set the TTL for the dependency key
      });

      // Execute the pipeline
      await pipeline.exec();
    } else {
      await redisClient.set(queryKey, compressedResult, 'EX', ttlInSeconds);
    }

    const t1 = process.hrtime.bigint();
    console.log('compressed result length', compressedResult.length);
    void logger('compression time snappy', beforeCompression, afterCompression);
    void logger('cacheQueryResult', t0, t1);
  }

  // Function to retrieve a cached query result
  async function getCachedQueryResult(queryKey: string, compress = true) {
    const t0 = process.hrtime.bigint();

    // Retrieve the cached query result based on query key
    const compressedResult = compress
      ? await redisClient.getBuffer(queryKey)
      : await redisClient.get(queryKey);

    if (!compressedResult) return null;

    // console.log('compressed length', compressedResult.length);

    // Decompress result
    const beforeCompression = process.hrtime.bigint();
    const result = compress ? uncompressSync(compressedResult) : compressedResult;
    const afterCompression = process.hrtime.bigint();

    const t1 = process.hrtime.bigint();

    // console.log('result length, ', result.length);

    void logger('getCachedQueryResult', t0, t1);
    void logger('decompression time snappy', beforeCompression, afterCompression);
    return result;
  }

  // Function to invalidate cache based on table updates
  async function invalidateCache(table: string) {
    const t0 = process.hrtime.bigint();

    const dependencyKey = `dependency:${table}`;
    const queriesToInvalidate = await redisClient.smembers(dependencyKey);

    if (queriesToInvalidate.length > 0) {
      // Create a pipeline to batch multiple operations
      const pipeline = redisClient.pipeline();

      queriesToInvalidate.forEach((queryKey) => pipeline.del(queryKey));
      pipeline.del(dependencyKey);

      await pipeline.exec();
    } else {
      // Clear the dependency set if it's the only key
      await redisClient.del(dependencyKey);
    }

    const t1 = process.hrtime.bigint();

    void logger('invalidateCache', t0, t1);
  }

  return { cacheQueryResult, invalidateCache, getCachedQueryResult };
};

export default CacheMunk;
