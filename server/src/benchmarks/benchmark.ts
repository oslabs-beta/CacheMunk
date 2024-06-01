import { getData } from '../controllers/cachingController.js';
import { percentile, calculateStdev, createHistogramBuckets } from '../util/stats.js';
// import { generateData } from './mock/data.js';
// import { generator } from './mock/generator.js';
import { timingFunc } from '../util/timing.js';

// DEFINE TESTING PARAMETERS
// const testTarget = cache;
const clients = 10; // number of simultaneous clients
const requests = 500; // requests per client
// const payloadLen = 2; // size of payload in KB
// const testKey = 'testKey';

// generate random data (array of objects)
// const arr = generateData(payloadLen, generator);

// serialize the array to JSON
// const serialized = JSON.stringify(arr);

// set the key in redis
// await testTarget.set(testKey, serialized, []);

// function to send requests
// const testFunc = async () => testTarget.get(testKey);
const testFunc = async () => getData('SELECT_CITIES_COSTLY');
const sendRequest = async () => timingFunc(testFunc);

// await getData('SELECT_CITIES_COSTLY');

// function to run a client
const runClient = async (): Promise<number[]> => {
  const clientTimes: number[] = [];
  for (let i = 0; i < requests; i++) {
    const [, execTime] = await sendRequest();
    clientTimes.push(execTime);
  }
  return clientTimes;
};

// Start benchmark

console.log('Starting tests');

// run clients in parallel
const clientsArr: Promise<number[]>[] = [];
const start = performance.now();
for (let i = 0; i < clients; i++) {
  clientsArr.push(runClient());
}

const res = await Promise.all(clientsArr);
const end = performance.now();
const totalExecTime = end - start;

const agg = res.reduce((prev, curr) => [...prev, ...curr]);

agg.sort((a, b) => a - b); // sort in ascending order
const min = agg[0];
const max = agg[agg.length - 1];
const n = agg.length;
const avgRps = (n / totalExecTime) * 1000;
const sum = agg.reduce((acc, curr) => acc + curr);
const mean = sum / n;
const stddev = calculateStdev(agg);
const p50 = percentile(agg, 50);
const p95 = percentile(agg, 95);
const p99 = percentile(agg, 99);
const [buckets, bucketLabels] = createHistogramBuckets(agg);
console.log({
  totalExecTime,
  avgRps,
  min,
  max,
  mean,
  stddev,
  n,
  p50,
  p95,
  p99,
  buckets,
  bucketLabels,
});
