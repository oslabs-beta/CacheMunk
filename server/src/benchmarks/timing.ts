import cache from '../cache/redisClient.js';
import { nanoid } from 'nanoid';

// generate long random string

const arr = [];

console.log('Generating array...');
for (let i = 0; i < 2_000; i++) {
  arr.push({
    someRandomData: nanoid(),
    someOtherData: nanoid() + 'commonsuffix123',
  });
}

const serialized = JSON.stringify(arr);

const binaryData = Buffer.from(serialized);

console.log(`Binary data length: ${binaryData.length / 1000}KB`);

// set test data in the cache
await cache.set('testKey', binaryData, [], 10);

const timingFunc = async <T>(fn: () => Promise<T>): Promise<[T, number]> => {
  const start = process.hrtime.bigint();
  const res = await fn();
  const end = process.hrtime.bigint();
  const execTime = Number(end - start) / 1_000_000;
  return [res, execTime];
};

async function getKey() {
  return await cache.get('testKey');
}

async function benchmark() {
  console.log('\nBenchmark ');
  const [, execTime] = await timingFunc(getKey);
  console.log(`query took ${execTime.toString()}ms`);
}

await benchmark();
await benchmark();
await benchmark();
