import { describe, test } from '@jest/globals';
import { calculateTimer } from './timer';

describe('renderTimer', () => {
  test('renders time', () => {
    const from = new Date();
    const to = new Date();

    const timer = calculateTimer(from, to);
    console.log(`timer: ${timer}`);

    expect(timer).toEqual('00:00:00');
  });

  test('renders time', () => {
    const from = new Date();
    const to = new Date(from.getTime() + 60 * 1000);

    console.log(from.toISOString());
    console.log(to.toISOString());

    const timer = calculateTimer(from, to);
    console.log(`timer: ${timer}`);

    expect(timer).toEqual('00:01:00');
  });
});
