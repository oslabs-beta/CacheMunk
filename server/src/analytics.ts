// Array to store response times
const cacheResponseTimes: number[] = [];

// Object to store cache hits and cache misses counters
const cacheInfo = {
  cacheHits: 0,
  cacheMisses: 0,
};

export const addResponse = (execTime: number): void => { cacheResponseTimes.push(execTime) };

export const incrCacheHits = (): void => { cacheInfo.cacheHits++ };
export const incrCacheMisses = (): void => { cacheInfo.cacheMisses++ };

export const getCacheInfo = () => cacheInfo;

export const getCacheResponseTimes = () => cacheResponseTimes;
