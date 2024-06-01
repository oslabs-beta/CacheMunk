import { expect } from 'chai';
import { percentile } from '../../server/dist/util/stats.js';

describe('Percentile function tests', () => {
  it('should return the correct median', () => {
    const data = [18, 1, 3, 4, 6, 8, 9, 15];
    const result = percentile(data, 50);
    expect(result).to.equal(7);
  });

  it('should return the correct p100', () => {
    const data = [18, 1, 3, 4, 6, 8, 9, 15];
    const result = percentile(data, 100);
    expect(result).to.equal(18);
  });

  it('should return the correct p25', () => {
    const data = [18, 1, 3, 4, 6, 8, 9, 15];
    const result = percentile(data, 25);
    expect(result).to.equal(3.75);
  });

  it('should return the correct p0', () => {
    const data = [18, 1, 3, 4, 6, 8, 9, 15];
    const result = percentile(data, 0);
    expect(result).to.equal(1);
  });
});
