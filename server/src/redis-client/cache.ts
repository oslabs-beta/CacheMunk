import { Redis } from 'ioredis';

const CacheMunk = (redisClient: Redis) => {
  if (!(redisClient instanceof Redis)) {
    throw new Error('redisClient must be an ioredis client');
  }

  // Function to cache a query result
  async function cacheQueryResult(queryKey: string, result: string, dependencies: string[]) {
    const setStart = process.hrtime.bigint();

    // Create a pipeline
    const pipeline = redisClient.pipeline();

    // Store the query result
    pipeline.set(queryKey, result);

    // Track dependencies
    for (const table of dependencies) {
      const dependencyKey = `dependency:${table}`;
      pipeline.sadd(dependencyKey, queryKey);
    }

    // Execute the pipeline
    await pipeline.exec();

    const setEnd = process.hrtime.bigint();
    const nanosecondsDifference = setEnd - setStart;
    const ms = Number(nanosecondsDifference) / 1_000_000; // Convert to milliseconds
    console.log(`cacheQueryResult took ${ms.toFixed(3)} milliseconds`);
  }

  async function getCachedQueryResult(queryKey: string) {
    const getStart = process.hrtime.bigint();

    // Retrieve the cached query result based on query key
    const result = await redisClient.get(queryKey);

    const getEnd = process.hrtime.bigint();
    const nanosecondsDifference = getEnd - getStart;
    const ms = Number(nanosecondsDifference) / 1_000_000; // Convert to milliseconds
    console.log(`getCachedQueryResult took ${ms.toFixed(3)} milliseconds`);

    return result;
  }

  // Function to invalidate cache based on table updates
  async function invalidateCache(table: string) {
    const invalidateStart = process.hrtime.bigint();

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

    const invalidateEnd = process.hrtime.bigint();
    const nanosecondsDifference = invalidateEnd - invalidateStart;
    const ms = Number(nanosecondsDifference) / 1_000_000; // Convert to milliseconds
    console.log(`invalidateCache took ${ms.toFixed(3)} milliseconds`);
  }

  return { cacheQueryResult, invalidateCache, getCachedQueryResult };
};

export default CacheMunk;
