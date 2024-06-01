// send a request, wait for response, return timing
export const timingFunc = async <T>(func: () => Promise<T>): Promise<[T, number]> => {
  const a = process.hrtime.bigint();
  const res = await func();
  const b = process.hrtime.bigint();
  const execTime = Number(b - a) / 1_000_000;
  return [res, execTime];
};
