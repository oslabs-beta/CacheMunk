import { expect } from 'chai';
import { timingFunc } from '../../server/dist/util/timing.js';

describe('Timing function', () => {
  const delay = 1;
  const testFunc = async (): Promise<number> =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(0);
      }, delay);
    });

  it('should return result and execTime', async () => {
    const [res, execTime] = await timingFunc(testFunc);
    expect(res).to.equal(0);
    expect(execTime).to.be.greaterThan(delay);
    expect(execTime).to.be.lessThan(delay + 1);
  });
});
