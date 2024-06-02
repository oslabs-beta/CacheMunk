import { getData } from '../controllers/cachingController.js';
import { percentile, calculateStdev, createHistogramBuckets } from '../util/stats.js';
import { timingFunc } from '../util/timing.js';
import { writeFile } from 'fs';

// DEFINE TESTING PARAMETERS
const clients = 10; // number of simultaneous clients
const requests = 500; // requests per client

// Function to perform the benchmarking
const runBenchmark = async (testFunc: () => Promise<any>, fileName: string) => {
  const sendRequest = async () => timingFunc(testFunc);

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

  const summaryStatistics: object = {   
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
    responseTimes: agg
  };

  // Write the aggregated times to a JSON file
  writeFile(fileName, JSON.stringify(summaryStatistics, null, 2), err => {
    if (err) {
      console.error(`Failed to save response times to ${fileName}:`, err);
    } else {
      console.log(`Response times saved successfully to ${fileName}`);
    }
  });
};

// Run the benchmark with cache
await runBenchmark(async () => getData('SELECT_CITIES_COSTLY'), 'responseTimes-cache.json');

// Run the benchmark without cache
await runBenchmark(async () => getData('SELECT_CITIES_COSTLY', "no-cache"), 'responseTimes-no-cache.json');
