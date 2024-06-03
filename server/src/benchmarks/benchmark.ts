import { percentile, calculateStdev } from '../util/stats.js';
import { timingFunc } from '../util/timing.js';

// DEFINE TESTING PARAMETERS

export const runTests = async (
  clients: number,
  requests: number,
  queryKey: string,
  testFunc: () => Promise<any>,
) => {
  const sendRequest = async () => timingFunc(testFunc);
  const delay = async (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  // function to run a client
  const runClient = async (): Promise<number[]> => {
    const clientTimes: number[] = [];
    for (let i = 0; i < requests; i++) {
      const [, execTime] = await sendRequest();
      clientTimes.push(execTime);
    }
    return clientTimes;
  };

  // run clients in parallel
  const clientsArr: Promise<number[]>[] = [];
  const start = performance.now();
  for (let i = 0; i < clients; i++) {
    clientsArr.push(runClient());
    await delay(5);
  }

  const res = await Promise.all(clientsArr);
  const end = performance.now();
  const totalExecTime = end - start;

  const agg = res.reduce((prev, curr) => [...prev, ...curr]);

  agg.sort((a, b) => a - b); // sort in ascending order
  const min = agg[0];
  const max = agg[agg.length - 1];
  const n = agg.length;
  const sum = agg.reduce((acc, curr) => acc + curr);
  const avgRps = (n / totalExecTime) * 1000;
  const mean = sum / n;
  const stddev = calculateStdev(agg);
  const p50 = percentile(agg, 50);
  const p95 = percentile(agg, 95);
  const p99 = percentile(agg, 99);
  return {
    sum,
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
    values: agg,
  };
};
