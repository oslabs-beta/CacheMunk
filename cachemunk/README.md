# CacheMunk
![CacheMunk Banner](https://cachemunk-readme.s3.amazonaws.com/cachemunk_logo_banner.png)
Application layer caching middleware library for Node.js and Redis. 
## 1. Description
Efficiently abstracts Redis to cache PostgreSQL query results at the application layer, enhancing Node.js applications with submillisecond latency.
## 2. Dependencies
- **ioredis:** robust, performant, flexible Redis client for Node.js
- **snappy:** fast data compression and decompression library, optimized for speed with a reasonable compression ratio
## 3. Features
- **Redis Integration**: Utilizes `ioredis` for Redis interactions, supporting both string and buffer data types.
- **Data Compression**: Implements data compression using `snappy` to reduce storage and bandwidth usage.
- **Configurable Options**: Allows setting of default TTL, maximum entry size, and custom event handlers for cache hits and misses.
- **Performance Monitoring**: Measures execution times for caching operations using high-resolution timestamps.
- **Layered Caching**: Features a first-level cache with a JavaScript `Map` for ultra-fast data retrieval.
- **Data Consistency**: Uses Redis transactions (pipelining) to ensure data integrity across multiple operations.
- **Cache Invalidation**: Provides methods to invalidate cache based on dependencies to handle stale data.
- **Error Handling**: Includes robust error management and size checks to prevent exceeding maximum entry size.
- **Cache Management Tools**: Offers functions to clear the cache, measure its size, and count the number of string keys.

## 4. Prerequisite: Install and Connect a Redis Server

If not already installed on your server, install Redis OSS (Redis Open Source Software)

- macOS using Homebrew:
  - At the terminal, type `brew install redis`
  - After installation completes, type `redis-server`
  - Your server should now have a Redis database connection open (note the port on which it is listening)
  - See more detailed instructions in the [Redis docs: Install Redis OSS on macOS](https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/install-redis-on-mac-os/)
- Ubuntu Linux :
  - You can install recent stable versions of Redis from the official packages.redis.io APT repository.
  - Add the repository to the apt index, update it, and then install:
    ```
    curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg

    echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/redis.list

    sudo apt-get update
    sudo apt-get install redis
    ```
  - After installation completes, run the following command to start the server
    ```
    sudo systemctl start redis-server
    ```
  - Your server should now have a Redis database connection open. You can use the command below to see a detailed status report (note the port on which it is listening)
    ```
    sudo systemctl status redis-server
    ```
## 6. Usage
### Install CacheMunk
Install the cachemunk library using npm. 'ioredis' and 'snappy' dependencies will be installed if needed.
```
npm install cachemunk
```
### Import the Library and `ioredis`
```
import { Redis } from 'ioredis';
import { configureCache } from 'cachemunk';
```
### Instantiate Redis
```
const redis = new Redis({
  host: '127.0.0.1',
  port: 6379
});

```
### Configure the Cache
```
const cache = configureCache({
  redis,
  defaultTtl: 3600, // optional, defaults to 3600 seconds (1 hour)
  maxEntrySize: 5000000, // optional, defaults to 5MB
  onCacheHit: (queryKey, executionTime) => {
    console.log(`Cache hit for key: ${queryKey} in ${executionTime}ms`);
  },
  onCacheMiss: (queryKey, executionTime) => {
    console.log(`Cache miss for key: ${queryKey} in ${executionTime}ms`);
  }
});
```

- **redis (required)**
  - **Type**: `Redis`
  - **Description**: The instance of ioredis to use for caching.

- **defaultTtl (optional)**
  - **Type**: `number`
  - **Default**: `3600` (1 hour)
  - **Description**: The default time-to-live (TTL) for cache entries in seconds.

- **maxEntrySize (optional)**
  - **Type**: `number`
  - **Default**: `5000000` (5 MB)
  - **Description**: The maximum size of a cache entry in bytes. Entries larger than this will not be cached.

- **onCacheHit (optional)**
  - **Type**: `EventHandler`
  - **Description**: A callback function to handle cache hits. It receives the query key and execution time in milliseconds as parameters.

- **onCacheMiss (optional)**
  - **Type**: `EventHandler`
  - **Description**: A callback function to handle cache misses. It receives the query key and execution time in milliseconds as parameters.


## Functions
configureCache is a factory function that returns the following methods for you to use wherever needed: 

### `set(queryKey: string, data: string | Buffer, dependencies: string[], ttlInSeconds?: number): Promise<void>`
Adds a query result to the cache.

- **queryKey:** The key under which the data is stored.
- **data:** The data to be cached, either as a string or a Buffer.
- **dependencies:** An array of dependencies associated with this cache entry.
- **ttlInSeconds:** Time-to-live for the cache entry in seconds (optional, defaults to the configured defaultTtl).

### `get(queryKey: string): Promise<string | null>`
Retrieves a cached query result.

- **queryKey:** The key of the cached data to retrieve.
- **Returns:** The cached data as a string, or null if the data is not found.

### `invalidate(dependency: string): Promise<void>`
Invalidates cache entries based on a dependency.

- **dependency:** The dependency key whose associated cache entries need to be invalidated.

### `clear(): Promise<void>`
Clears the entire cache for the current Redis database.

### `getSize(): Promise<number>`
Returns the total number of keys in the current Redis database.

### `getStringKeySize(): Promise<number>`
Returns the number of string keys in the current Redis database.


## Example 
```
import { Redis } from 'ioredis';
import { configureCache } from 'cachemunk';

const redis = new Redis({
  host: '127.0.0.1', // modify as needed or pass in as env variable
  port: 6379 // modify as needed or pass in as env variable
});

const cache = configureCache({
  redis,
  defaultTtl: 3600,
  maxEntrySize: 5000000,
  onCacheHit: (queryKey, executionTime) => {
    console.log(`Cache hit for key: ${queryKey} in ${executionTime}ms`);
  },
  onCacheMiss: (queryKey, executionTime) => {
    console.log(`Cache miss for key: ${queryKey} in ${executionTime}ms`);
  }
});

async function testCache() {
    try {
        console.log('\n====================');
        console.log('Testing cache.set and cache.get');
        console.log('====================\n');
        
        // Call the set function with a queryKey, data, and an array of dependencies
        await cache.set('testKey', 'testValue', []);

        // Call the get function to retrieve the cached value
        let value = await cache.get('testKey');
        console.log("\ntestKey:", value); // Should print 'testValue'

        console.log('\n====================');
        console.log('Testing cache.invalidate');
        console.log('====================\n');

        // Call the set function with a queryKey, data, and an array of dependencies
        await cache.set('testKey2', 'testValue to be invalidated', ['testDependency']);

        // Call the get function to retrieve the cached value
        value = await cache.get('testKey2');
        console.log("\ntestKey2 before invalidation:", value); // Should print 'testValue to be invalidated'

        // Invalidate cache for a dependency
        await cache.invalidate('testDependency');

        // Introduce a 50ms delay to clear L1 Cache
        await new Promise(resolve => setTimeout(resolve, 50));
        
        // Call the get function to retrieve the invalidated value
        value = await cache.get('testKey2');
        console.log("\ntestKey2 after invalidation:", value); // Should print null
        
        console.log('\n====================');
        console.log('Adding additional keys to cache');
        console.log('====================\n');
        
        // Introduce a 50ms delay to clear L1 Cache
        await new Promise(resolve => setTimeout(resolve, 50));

        
        console.log('\n====================');
        console.log('Testing cache.clear');
        console.log('====================\n');
        
        // Clear the entire cache
        await cache.clear();
        
        // Attempt to get the value after clearing cache
        value = await cache.get('testKey');
        console.log("\ntestKey after clear:", value); // Should print null
        
        console.log('\n====================');
        console.log('Testing cache.getSize');
        console.log('====================\n');

        // Add two additional keys to the cache
        await cache.set('additionalKey1', 'value 1', ['testDependency']);
        await cache.set('additionalKey2', 'value 2', []);
        
        // Check the size of the cache
        const size = await cache.getSize();
        console.log("\nCache size:", size); // Should print the size of the cache (number of keys)

        console.log('\n====================');
        console.log('Testing cache.getStringKeySize');
        console.log('====================\n');

        // Check the size of the cache for string keys
        const stringKeySize = await cache.getStringKeySize();
        console.log("\nString key size:", stringKeySize); // Should print the number of string keys in the cache

        // Exit the process
        process.exit(0);
    } catch (error) {
        console.error('\n====================');
        console.error('Error:', error);
        console.error('====================\n');
        // Exit with error code
        process.exit(1);
    }
}

testCache();

```









