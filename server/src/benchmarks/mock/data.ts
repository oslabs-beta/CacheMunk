// generates (array of objects) for testing
// target size in KB (bytes * 1024) when stringified
export const generateData = (targetSize: number, generator: () => object): object[] => {
  const calcByteLen = (input: object): number => Buffer.byteLength(JSON.stringify(input));

  // check that generator function is pure wrt. size of output in bytes
  const byteLen = calcByteLen(generator());
  if (byteLen !== calcByteLen(generator())) {
    throw new Error('Generator function must be pure wrt. output size in bytes');
  }

  const arr: object[] = [];

  // calculate number of iterations required to reach target
  const targetByteSize = targetSize * 1024; // convert KB to bytes
  const iterations = Math.ceil((targetByteSize - 1) / (byteLen + 1));

  for (let i = 0; i < iterations; i++) {
    const item = generator();
    arr.push(item);
  }

  return arr;
};
