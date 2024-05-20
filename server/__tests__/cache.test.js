import { expect } from 'chai';
import { Redis } from 'ioredis';
import { createCache } from '../dist/redis-client/cache.js'


const redis = new Redis({ port: 6379, host: '127.0.0.1' });

describe('CacheMunk tests', () => {
  // Describe the test suite for the createCache function

  describe('createCache Function', () => {
    // Test case to check if createCache is defined
    it('should be defined', () => {
      expect(createCache).to.exist;
    });

    it('should provide three cache functions', () => {
      const { get, set, invalidate } = createCache(redis);
      expect(get).not.to.be.undefined;
      expect(set).not.to.be.undefined;
      expect(invalidate).not.to.be.undefined;
    });
  });

  it('should add and retrieve resources from cache', async () => {
    const testObj = {
      name: 'astring',
      arr: ['a', 'b', 'c'],
      nestedArr: [1, 2, [3, 4]],
    }

    const stringifiedObj = JSON.stringify(testObj);
    const { get, set } = createCache(redis);
    await set('testKey1', stringifiedObj, [], 2);
    const val = await get('testKey1');
    expect(val).to.equal(stringifiedObj);
  });

  it('should return null if the requested resource does not exist', async () => {
    const { get } = createCache(redis);
    const val = await get('testKey2');
    expect(val).to.be.null;
  });

  it('should count cache hits and misses', async () => {
    const testObj = {
      name: 'astring',
      arr: ['a', 'b', 'c'],
      nestedArr: [1, 2, [3, 4]],
    }
    
    let hits = 0;
    let misses = 0;

    const stringifiedObj = JSON.stringify(testObj);

    const { get, set } = createCache(redis, {
      onCacheHit: () => { hits++ },
      onCacheMiss: () => { misses++ },
    });

    await set('anotherTestKey', stringifiedObj, [], 2);
    await get('anotherTestKey'); // hit
    await get('missingTestKey'); // miss
    await get('anotherTestKey'); // hit
    expect(hits).to.equal(2);
    expect(misses).to.equal(1);
  });

})



