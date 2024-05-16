export const logger = async (name: string, start: bigint, end: bigint): Promise<void> => {
  await Promise.resolve();

  const nanosecondsDifference = end - start;
  const ms = Number(nanosecondsDifference) / 1_000_000; // Convert to milliseconds

  const log = {
    level: 'info',
    type: 'execution_time',
    timestamp: new Date().toISOString(),
    name,
    execution_time: parseFloat(ms.toFixed(3)), // execution time in milliseconds
  };

  console.log(log);
};
