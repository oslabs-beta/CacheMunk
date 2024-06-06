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
Install the cachemunk library using npm. `ioredis` and `snappy` dependencies will be installed if needed.
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
  host: '127.0.0.1', // modify as needed or pass in as env variable
  port: 6379 // modify as needed or pass in as env variable
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

configureCache() is a factory function that returns the following methods for you to use wherever needed. 

#### `set(queryKey: string, data: string | Buffer, dependencies: string[], ttlInSeconds?: number): Promise<void>`
Adds a query result to the cache.

- **queryKey:** The key under which the data is stored.
- **data:** The data to be cached, either as a string or a Buffer.
- **dependencies:** An array of dependencies associated with this cache entry.
- **ttlInSeconds:** Time-to-live for the cache entry in seconds (optional, defaults to the configured defaultTtl).

#### `get(queryKey: string): Promise<string | null>`
Retrieves a cached query result.

- **queryKey:** The key of the cached data to retrieve.
- **Returns:** The cached data as a string, or null if the data is not found.

#### `invalidate(dependency: string): Promise<void>`
Invalidates cache entries based on a dependency.

- **dependency:** The dependency key whose associated cache entries need to be invalidated.

#### `clear(): Promise<void>`
Clears the entire cache for the current Redis database.

#### `getSize(): Promise<number>`
Returns the total number of keys in the current Redis database.

#### `getStringKeySize(): Promise<number>`
Returns the number of string keys in the current Redis database.

## Integrating with PostgreSQL

To integrate with PostgreSQL, create your Pool instance and write your own wrapper functions that call functions from the cachemunk library to set, get and invalidate query results. Here are some simple examples.

### Create a new Pool Instance

```
import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres', // Replace with your PostgreSQL user
  host: 'localhost', // Replace with your PostgreSQL host
  database: 'mydatabase', // Replace with your PostgreSQL database
  password: 'mypassword', // Replace with your PostgreSQL password
  port: 5432, // Replace with your PostgreSQL port
});
```

### Define a query function 

```
export const query = async (text, params) => {
  try {
    const result = await pool.query(text, params);
    return result;
  } catch (err) {
    console.error(`Error executing query ${text}:`, err);
    throw err; // Re-throw the error after logging it
  }
};
```

### Define a getData() function that uses cachemunk `get` and `set`

```
// Define getData function
const getData = async (queryKey, queryText, dependencies) => {
  // Check the cache
  const cachedResult = await cache.get(queryKey);
  if (cachedResult) {
    console.log('Cache hit');
    return JSON.parse(cachedResult);
  }

  // Query the database if not cached
  const result = await query(queryText);

  // Cache the result
  await cache.set(queryKey, JSON.stringify(result.rows), dependencies);

  console.log('Cache miss');
  return result.rows;
};
```

### Define an insertData() function that uses cachemunk `invalidate`

```
// Define insertData function with cache invalidation
const insertData = async (insertText, dependencies) => {
  // Execute the insert query
  try {
    const result = await query(insertText);

    // Invalidate the cache for the specific dependencies
    await cache.invalidate(dependencies);

    console.log('Cache invalidated for dependencies:', dependencies);
    return result;
  } catch (err) {
    console.error(`Error executing insert ${insertText}:`, err);
    throw err; // Re-throw the error after logging it
  }
};

```

## Example - Test Factory Functions with Redis Only

You can copy, paste, and run the code the code below to see these functions in action!

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

## Example - Test Factory Functions with Redis and PostgreSQL 

### Cachemunk Integrated with PostgreSQL

Copy, paste, and run the code the code below to see the library in action, integrated with PostgreSQL and Redis. It assumes you have a Redis server and PostgreSQL server running locally with a database called "mydatabase". 

```
import pkg from 'pg';
const { Pool } = pkg;
import { Redis } from 'ioredis';
import { configureCache } from 'cachemunk';

// Configure Redis
const redis = new Redis({
  host: '127.0.0.1', // Replace with your Redis host
  port: 6379 // Replace with your Redis port
});

// Configure Cachemunk
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

// Create a new Pool instance
const pool = new Pool({
  user: 'postgres', // Replace with your PostgreSQL user
  host: 'localhost', // Replace with your PostgreSQL host
  database: 'mydatabase', // Replace with your PostgreSQL database
  password: 'mypassword', // Replace with your PostgreSQL password
  port: 5432, // Replace with your PostgreSQL port
});

// Define a query function
const query = async (text) => {
  try {
    const result = await pool.query(text);
    return result;
  } catch (err) {
    console.error(`Error executing query ${text}:`, err);
    throw err; // Re-throw the error after logging it
  }
};

// Define getData function
const getData = async (queryKey, queryText, dependencies) => {
  // Check the cache
  await delay(50); // Delay before interacting with cache
  const cachedResult = await cache.get(queryKey);
  if (cachedResult) {
    console.log('Cache hit');
    return JSON.parse(cachedResult);
  }

  // Query the database if not cached
  const result = await query(queryText);

  // Cache the result
  await delay(50); // Delay before interacting with cache
  await cache.set(queryKey, JSON.stringify(result.rows), dependencies);

  console.log('Cache miss');
  return result.rows;
};

// Define insertData function with cache invalidation
const insertData = async (insertText, dependencies) => {
  // Execute the insert query
  try {
    const result = await query(insertText);

    // Invalidate the cache for the specific dependencies
    await delay(50); // Delay before interacting with cache
    await cache.invalidate(dependencies);

    console.log('Cache invalidated for dependencies:', dependencies);
    return result;
  } catch (err) {
    console.error(`Error executing insert ${insertText}:`, err);
    throw err; // Re-throw the error after logging it
  }
};

// Define a function to fetch the entire table
const fetchAllData = async () => {
  try {
    const result = await query('SELECT * FROM mytable');
    return result.rows;
  } catch (err) {
    console.error('Error fetching all data:', err);
    throw err;
  }
};

// Define a function to setup the database
const setupDatabase = async () => {
  try {
    // Drop the table if it exists
    await query('DROP TABLE IF EXISTS mytable');

    // Drop the sequence if it exists to avoid duplicate key issues
    await query('DROP SEQUENCE IF EXISTS mytable_id_seq');

    // Create the table
    await query(`
      CREATE TABLE mytable (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      );
    `);

    // Insert initial dummy data
    await query("INSERT INTO mytable (name) VALUES ('First Entry')");
    await query("INSERT INTO mytable (name) VALUES ('Second Entry')");
    await query("INSERT INTO mytable (name) VALUES ('Third Entry')");
  } catch (err) {
    console.error('Error setting up the database:', err);
    throw err;
  }
};

// Define a function to clear all cache
const clearCache = async () => {
  try {
    await cache.clear();
    console.log('All cache keys cleared.');
  } catch (err) {
    console.error('Error clearing cache:', err);
  }
};

// Delay function to wait for a specified number of milliseconds
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const main = async () => {
  try {
    // Setup the database
    await setupDatabase();

    // Insert data and invalidate the cache
    const insertText1 = "INSERT INTO mytable (name) VALUES ('New Entry 1')";
    const dependencies = ['dependency1'];

    // Delay before interacting with cache
    await delay(50);
    await insertData(insertText1, dependencies);

    // Delay before interacting with cache
    await delay(50);
    // Get data (should query the database and cache the result)
    const queryKey = 'myQueryKey';
    const queryText = 'SELECT * FROM mytable';
    let data = await getData(queryKey, queryText, dependencies);
    console.log('Data:', data);

    // Delay before interacting with cache
    await delay(50);
    // Perform a cache hit
    data = await getData(queryKey, queryText, dependencies);
    console.log('Data (cache hit):', data);

    // Delay before interacting with cache
    await delay(50);
    // Insert more data and invalidate the cache
    const insertText2 = "INSERT INTO mytable (name) VALUES ('New Entry 2')";
    await insertData(insertText2, dependencies);

    // Delay before interacting with cache
    await delay(50);
    // Get data again (should query the database again due to invalidation)
    const dataAfterInsert = await getData(queryKey, queryText, dependencies);
    console.log('Data after insert:', dataAfterInsert);

    // Delay before interacting with cache
    await delay(50);
    // Fetch and show the entire table
    const allData = await fetchAllData();
    console.log('All data in mytable:', allData);

    // Clear all cache keys
    console.log('Clearing all cache keys...');
    await clearCache();

    // Verify cache is cleared by attempting to get data
    console.log('Verifying cache is cleared...');
    data = await getData(queryKey, queryText, dependencies);
    console.log('Data after cache clear:', data);

  } catch (error) {
    console.error('Error:', error);
  }
};

main();
```
## Issues

## Contributors
![Olivia Carlisle](https://github.com/oliviacarlisle.png?size=100)

Olivia Carlisle 
Github: [@oliviacarlisle](https://github.com/oliviacarlisle)

![Jayan Pillai](https://github.com/jrpillai.png?size=100)

Jayan Pillai 
Github: [@jrpillai](https://github.com/jrpillai)

![Nick Angelopoulous](https://github.com/nickangel7.png?size=100)

Nick Angelopoulous 
Github: [@nickangel7](https://github.com/nickangel7)

![Amy YQ Jiang](https://github.com/yj776.png?size=100)

Amy YQ Jiang 
Github: [@yj776](https://github.com/yj776)
