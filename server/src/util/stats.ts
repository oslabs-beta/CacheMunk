/**
 * Calculate the nth percentile of an array of numbers.
 * @param arr - The array of numbers.
 * @param percentile - The desired percentile (between 0 and 100).
 * @returns The nth percentile value.
 */
export const percentile = (arr: number[], percentile: number): number => {
  if (percentile < 0 || percentile > 100) {
    throw new Error('Percentile must be between 0 and 100.');
  }
  if (arr.length === 0) {
    throw new Error('Array cannot be empty.');
  }

  // Sort the array in ascending order
  const sortedArr = arr.slice().sort((a, b) => a - b);

  // Calculate the rank (position) of the percentile
  const rank = (percentile / 100) * (sortedArr.length - 1);

  // Determine the indices for interpolation
  const lowerIndex = Math.floor(rank);
  const upperIndex = Math.ceil(rank);

  // If the rank is an integer, return the element at that position
  if (lowerIndex === upperIndex) {
    return sortedArr[lowerIndex];
  }

  // Otherwise, interpolate between the two bounding values
  const lowerValue = sortedArr[lowerIndex];
  const upperValue = sortedArr[upperIndex];
  const weight = rank - lowerIndex;

  return lowerValue + weight * (upperValue - lowerValue);
};

export const calculateStdev = (numbers: number[]): number => {
  const n = numbers.length;
  const mean = numbers.reduce((sum, num) => sum + num, 0) / n;
  const variance = numbers.reduce((sum, num) => sum + Math.pow(num - mean, 2), 0) / (n - 1);
  return Math.sqrt(variance);
};

export const createHistogramBuckets = (numbers: number[]): [number[], number[]] => {
  const min = Math.min(...numbers);
  const max = Math.max(...numbers);
  const range = max - min;
  const bucketSize = range / 20;

  const buckets: number[] = Array<number>(20).fill(0);
  const bucketLabels: number[] = [];
  let acc = min;
  for (let i = 0; i <= 20; i++) {
    bucketLabels.push(Number(acc.toFixed(3)));
    acc += bucketSize;
  }

  for (const num of numbers) {
    const bucketIndex = Math.min(Math.floor((num - min) / bucketSize), 19);
    buckets[bucketIndex]++;
  }

  return [buckets, bucketLabels];
};
