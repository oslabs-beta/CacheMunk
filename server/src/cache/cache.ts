import { Redis } from 'ioredis';
import { compress, uncompress } from 'snappy';

type EventHandler = (queryKey: string, executionTime: number) => void;

interface Config {
  redis: Redis,
  onCacheHit?: EventHandler,
  onCacheMiss?: EventHandler,
}

export const configureCache = (options: Config) => {

  const { redis } = options;

  if (!(redis instanceof Redis)) {
    throw new Error('ioredis client not found');
  }

  const { onCacheHit, onCacheMiss } = options;

  const calcExecTime = (start: bigint, end: bigint) => {
    const diff = end - start;
    return Number(diff) / 1_000_000; // convert nanoseconds to milliseconds
  };

  // Function to add a query result to the cache
  async function set(
    queryKey: string,
    data: string | Buffer,
    dependencies: string[],
    ttlInSeconds = 3600, // default to 1 hour in seconds
  ): Promise<void> {
    // Capture initial timestamp for performance monitoring
    const start = process.hrtime.bigint();

    // Convert data to binary Buffer if it is a string
    const binaryData = typeof data === 'string' ? Buffer.from(data) : data;

    // Compress buffer to save bandwidth
    const compressedData = await compress(binaryData);
    
    if (dependencies.length > 0) {
      // Create a pipeline
      const pipeline = redis.multi();

      // Store the query result
      pipeline.set(queryKey, compressedData, 'EX', ttlInSeconds);

      // Track dependencies
      dependencies.forEach((dependency) => {
        const dependencyKey = `dependency:${dependency}`;
        pipeline.sadd(dependencyKey, queryKey);
        pipeline.expire(dependencyKey, ttlInSeconds); // Set the TTL for the dependency key
      });

      // Execute the pipeline
      await pipeline.exec();
    } else {
      await redis.set(queryKey, compressedData, 'EX', ttlInSeconds);
    }

    // Capture final timestamp
    const end = process.hrtime.bigint();

    console.log(`write data to cache in ${calcExecTime(start, end).toFixed(3)}`);
  }

  // Function to retrieve a cached query result 
  async function get(queryKey: string): Promise<string | null> {
    // Capture initial timestamp for performance monitoring
    const start = process.hrtime.bigint();

    // Retrieve the cached query result based on query key
    const compressedData = await redis.getBuffer(queryKey);

    // Handle cache miss
    if (!compressedData) {
      // this is a cache miss
      // to do: log cache miss
      const end = process.hrtime.bigint();
      if (onCacheMiss) onCacheMiss(queryKey, calcExecTime(start, end));
      console.log(`cache miss in ${calcExecTime(start, end).toFixed(3)}`);
      return null;
    }

    // Decompress result
    const binaryData = await uncompress(compressedData);

    // Convert result to string
    const data = binaryData.toString();

    // Capture final timestamp
    const end = process.hrtime.bigint();

    if (onCacheHit) onCacheHit(queryKey, calcExecTime(start, end));
    console.log(`cache hit in ${calcExecTime(start, end).toFixed(3)}`);
    return data;
  }

  // Function to invalidate cache based on table updates
  async function invalidate(dependency: string) {
    const start = process.hrtime.bigint();

    const dependencyKey = `dependency:${dependency}`;

    const queriesToInvalidate = await redis.smembers(dependencyKey);

    if (queriesToInvalidate.length > 0) {
      // Create a pipeline to batch multiple operations
      const pipeline = redis.multi();

      queriesToInvalidate.forEach((queryKey) => pipeline.del(queryKey));
      pipeline.del(dependencyKey);

      await pipeline.exec();
    } else {
      // Clear the dependency set if it's the only key
      await redis.del(dependencyKey);
    }

    const end = process.hrtime.bigint();

    console.log(`cache invalidate in ${calcExecTime(start, end).toFixed(3)}`);
  }

  return { set, get, invalidate };
};

export default configureCache;
