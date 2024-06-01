import { expect } from 'chai';
import { generateData } from '../../server/dist/benchmarks/mock/data.js';
import { generator } from '../../server/dist/benchmarks/mock/generator.js';

describe('Mock data generator tests', () => {
  const test = (): boolean => {
    const byteLen = Buffer.byteLength(JSON.stringify(generator()));

    const testKb = (n: number): boolean => {
      const data = generateData(n, generator);
      const totalByteLen = Buffer.byteLength(JSON.stringify(data));
      if (totalByteLen - (byteLen + 1) >= n * 1024) {
        return false;
      }
      return true;
    };

    return testKb(10) && testKb(20) && testKb(150) && testKb(300);
  };

  it('should corretly generate semi-random data payloads of various sizes', () => {
    expect(test()).to.equal(true);
  });
});
