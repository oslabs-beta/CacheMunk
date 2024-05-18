import EVENT from './events.js';

export const logger = async (name: string, start: bigint, end: bigint, originalSize?: number, compressedSize?: number): Promise<void> => {
  
  const timestamp = new Date().toISOString();
  const nanosecondsDifference = end - start;
  const ms = Number(nanosecondsDifference) / 1_000_000; // Convert to milliseconds

  const log = {
    level: 'info',
    type: 'execution_time',
    timestamp,
    name,
    execution_time: parseFloat(ms.toFixed(3)), // execution time in milliseconds
  };

  console.log(log);

  // send the log to a database for monitoring
  await Promise.resolve();
};
