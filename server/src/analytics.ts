// Array to store response times
let cacheResponseTimes: number[] = [];

// Object to store cache hits and cache misses counters
const cacheInfo = {
  cacheHits: 0,
  cacheMisses: 0,
};

export const addResponse = (execTime: number): void => {
  cacheResponseTimes.push(execTime);
};

export const resetResponse = (): void => {
  cacheResponseTimes = [];
};

export const incrCacheHits = (): void => {
  cacheInfo.cacheHits++;
};

export const incrCacheMisses = (): void => {
  cacheInfo.cacheMisses++;
};

export const resetCache = (): void => {
  cacheInfo.cacheHits = 0;
  cacheInfo.cacheMisses = 0;
};

export const getCacheInfo = () => cacheInfo;

export const getCacheResponseTimes = (): number[] => cacheResponseTimes;
