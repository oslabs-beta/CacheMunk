import { nanoid } from 'nanoid';

// generate semi-random data in object format
export const generator = (): object => ({
  someRandomData: nanoid(),
  someOtherData: nanoid(),
  someOtherKey: 'someOtherCommonValue',
});
