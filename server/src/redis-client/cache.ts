import { performance } from 'perf_hooks';
import { Redis } from 'ioredis';

function CacheMunk(redisClient: Redis) {
  // Function to cache a query result
  async function cacheQueryResult(queryKey: string, result: any, dependencies: string[]) {
    const setStart = performance.now();

    // Store the query result
    await redisClient.set(queryKey, JSON.stringify(result));

    // Track dependencies
    for (const table of dependencies) {
      const dependencyKey = `dependency:${table}`;
      await redisClient.sadd(dependencyKey, queryKey);
    }

    const setEnd = performance.now();
    const ms = setEnd - setStart;
    console.log(`cacheQueryResult took ${ms.toString()} milliseconds`);
  }

  return { cacheQueryResult };
}

export default CacheMunk;
