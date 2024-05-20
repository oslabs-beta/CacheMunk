import { Buffer } from 'node:buffer';
import { Redis } from 'ioredis';
import { compress, uncompress } from 'snappy';

interface Config {
  onCacheHit?: (queryKey: string, executionTime: number, dataLengthBytes: number) => void,
  onCacheMiss?: (queryKey: string, executionTime: number) => void,
  onRead?: (queryKey: string, executionTime: number, originalSizeBytes: number, compressedSizeBytes: number) => void,
  onWrite?: (queryKey: string, executionTime: number, originalSizeBytes: number, compressedSizeBytes: number) => void,
  onInvalidate?: (queryKey: string, executionTime: number) => void;
}

export const createCache = (redis: Redis, options?: Config) => {

  if (!(redis instanceof Redis)) {
    throw new Error('ioredis client not found');
  }

  const { onCacheHit, onCacheMiss, onRead, onWrite } = options ?? {};

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
    const t0 = process.hrtime.bigint();

    // Convert data to binary Buffer if it is a string
    const binaryData = typeof data === 'string' ? Buffer.from(data) : data;

    // Compress buffer to save bandwidth
    const compressedData = await compress(binaryData);
    
    if (dependencies.length > 0) {
      // Create a pipeline
      const pipeline = redis.pipeline();

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
    const t1 = process.hrtime.bigint();

    const originalSize = Buffer.byteLength(binaryData);
    const compressedSize = Buffer.byteLength(compressedData);

    if (onWrite) onWrite(queryKey, calcExecTime(t0, t1), originalSize, compressedSize);
  }

  // Function to retrieve a cached query result 
  async function get(queryKey: string): Promise<string | null> {
    // Capture initial timestamp for performance monitoring
    const t0 = process.hrtime.bigint();

    // Retrieve the cached query result based on query key
    const compressedData = await redis.getBuffer(queryKey);

    // Handle cache miss
    if (!compressedData) {
      // this is a cache miss
      // to do: log cache miss
      const t1 = process.hrtime.bigint();
      if (onCacheMiss) onCacheMiss(queryKey, calcExecTime(t0, t1));
      return null;
    }

    // Decompress result
    const binaryData = await uncompress(compressedData);

    // Convert result to string
    const data = binaryData.toString();

    // Capture final timestamp
    const t1 = process.hrtime.bigint();

    const compressedSize = Buffer.byteLength(compressedData);
    const decompressedSize = Buffer.byteLength(binaryData);

    // Log cache hit
    if (onCacheHit) onCacheHit(queryKey, calcExecTime(t0, t1), decompressedSize);

    return data;
  }

  // Function to invalidate cache based on table updates
  async function invalidate(dependency: string) {
    const t0 = process.hrtime.bigint();

    const queriesToInvalidate = await redis.smembers(dependency);

    if (queriesToInvalidate.length > 0) {
      // Create a pipeline to batch multiple operations
      const pipeline = redis.pipeline();

      queriesToInvalidate.forEach((queryKey) => pipeline.del(queryKey));
      pipeline.del(dependency);

      await pipeline.exec();
    } else {
      // Clear the dependency set if it's the only key
      await redis.del(dependency);
    }

    const t1 = process.hrtime.bigint();
  }

  return { set, get, invalidate };
};

export default createCache;
