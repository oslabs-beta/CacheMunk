import { expect } from 'chai';
import { Redis } from 'ioredis';
import { configureCache } from '../../server/dist/cache/cache.js';

describe('CacheMunk tests', () => {
  const redis = new Redis({ port: 6379, host: '127.0.0.1' });
  const { get, set, invalidate } = configureCache({ redis });

  before(async () => {
    await redis.flushall();
  });

  it('cache functions should be defined', () => {
    expect(get).not.to.be.undefined;
    expect(set).not.to.be.undefined;
    expect(invalidate).not.to.be.undefined;
  });

  it('should preserve data integrity', async () => {
    const testData = {
      name: 'astring',
      arr: ['a', 'b', 'c'],
      nestedArr: [1, 2, [3, 4]],
    };

    const stringifiedObj = JSON.stringify(testData);
    await set('testKey1', stringifiedObj, []);
    const val = await get('testKey1');
    expect(val).to.equal(stringifiedObj);
  });

  it('should return null if the requested resource does not exist', async () => {
    const val = await get('testKey2');
    expect(val).to.be.null;
  });

  it('should invalidate dependencies', async () => {
    await set('key1', 'val1', ['dep1']);
    expect(await get('key1')).to.equal('val1');

    await invalidate('dep1');
    expect(await get('key1')).to.be.null;
  });

  after(async () => {
    await redis.flushall();
    await redis.quit();
  });
});
