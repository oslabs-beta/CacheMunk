import { Redis } from 'ioredis';
import { compress, uncompress } from 'snappy';

type EventHandler = (queryKey: string, executionTime: number) => void;

interface Config {
  redis: Redis;
  defaultTtl?: number;
  maxEntrySize?: number;
  onCacheHit?: EventHandler;
  onCacheMiss?: EventHandler;
}
// write cache in the functional style (creator function)
// instead of class (OOP) syntax for stronger encapsulation
export const configureCache = (options: Config) => {
  const { redis } = options;

  // checks that redis passed in is an instance of Redis
  if (!(redis instanceof Redis)) {
    throw new Error('ioredis client not found');
  }

  // set default ttl to 1 hour (3600 seconds)
  const defaultTtl = options.defaultTtl && options.defaultTtl > 0 ? options.defaultTtl : 3600;

  // set default maxEntrySize to 5MB (5_000_000 bytes)
  const maxEntrySize =
    options.maxEntrySize && options.maxEntrySize > 0 ? options.maxEntrySize : 5_000_000;

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
    ttlInSeconds = defaultTtl, // default to 1 hour in seconds
  ): Promise<void> {
    // Capture initial timestamp for performance monitoring
    // const start = process.hrtime.bigint();

    // Convert data to binary Buffer if it is a string
    const binaryData = typeof data === 'string' ? Buffer.from(data) : data;

    // check if binary Data exceeds maxEntrySize
    if (binaryData.length > maxEntrySize) {
      throw new Error('maxEntrySize exceeded');
    }

    // Compress buffer to save bandwidth using snappy. To further compress buffer. ex: 10kb ->3 kb
    const compressedData = await compress(binaryData);

    if (dependencies.length > 0) {
      // Create a pipeline/transaction (ensure data integrity and consistency. If one fail, all fails)
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
    // const end = process.hrtime.bigint();

    // console.log(`write data to cache in ${calcExecTime(start, end).toFixed(3)}`);
  }

  // Function to retrieve a cached query result
  async function get(queryKey: string): Promise<string | null> {
    // Capture initial timestamp for performance monitoring
    const start = process.hrtime.bigint();

    // Retrieve the cached query result based on query key
    // const startReq = process.hrtime.bigint();
    const compressedData = await redis.getBuffer(queryKey);
    // const endReq = process.hrtime.bigint();

    // Handle cache miss
    if (!compressedData) {
      // this is a cache miss
      // to do: log cache miss
      const end = process.hrtime.bigint();
      if (onCacheMiss) onCacheMiss(queryKey, calcExecTime(start, end));
      // console.log(`cache miss in ${calcExecTime(start, end).toFixed(3)}`);
      return null;
    }

    // Decompress result
    // const startSnappy = process.hrtime.bigint();
    const binaryData = await uncompress(compressedData);
    // const endSnappy = process.hrtime.bigint();

    // Convert result to string
    const data = binaryData.toString();

    // Capture final timestamp
    const end = process.hrtime.bigint();

    if (onCacheHit) onCacheHit(queryKey, calcExecTime(start, end));
    // console.log(`response from redis in ${calcExecTime(startReq, endReq).toFixed(3)}`);
    // console.log(`compressed data size ${compressedData.length / 1000} KB`);
    // console.log(`decompression in ${calcExecTime(startSnappy, endSnappy).toFixed(3)}`);
    // console.log(`cache hit in ${calcExecTime(start, end).toFixed(3)}`);
    return data;
  }

  // Function to invalidate cache based on table updates
  async function invalidate(dependency: string) {
    // const start = process.hrtime.bigint();

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

    // const end = process.hrtime.bigint();

    // console.log(`cache invalidate in ${calcExecTime(start, end).toFixed(3)}`);
  }

  // Function to clear the cache
  async function clear(): Promise<void> {
    try {
      const result = await redis.flushall();
      console.log('Cache for the current database cleared', result);
    } catch (err) {
      console.error('Error clearing cache:', err);
    }
  }

  async function getSize(): Promise<number> {
    try {
      const size = await redis.dbsize();
      return size;
    } catch (err) {
      console.error('Error getting cache size', err);
      return 0;
    }
  }

  async function getStringKeySize(): Promise<number> {
    let cursor = '0';
    let stringKeyCount = 0;
  
    try {
      do {
        const [newCursor, keys] = await redis.scan(cursor, 'COUNT', 100);
  
        cursor = newCursor;
        for (const key of keys) {
          const type = await redis.type(key);
          if (type === 'string') {
            stringKeyCount++;
          }
        }
      } while (cursor !== '0');
  
      return stringKeyCount;
    } catch (err) {
      console.error('Error getting string key size', err);
      return 0;
    }
  }

  return { set, get, invalidate, clear, getSize, getStringKeySize };
};

export default configureCache;
