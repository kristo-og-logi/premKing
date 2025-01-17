import { describe, test } from '@jest/globals';
import { calculateTimer } from './timer';

describe('renderTimer', () => {
  test('renders time', () => {
    const from = new Date();
    const to = new Date();

    const timer = calculateTimer(from, to);

    expect(timer).toEqual('00:00:00');
  });

  test('renders time', () => {
    const from = new Date();
    const to = new Date(from.getTime() + 60 * 1000);

    const timer = calculateTimer(from, to);

    expect(timer).toEqual('00:01:00');
  });

  test('renders time', () => {
    const from = new Date();
    const min = 42;
    const to = new Date(from.getTime() + 60 * 1000 * min);

    const timer = calculateTimer(from, to);

    expect(timer).toEqual(`00:${min}:00`);
  });

  test('renders time', () => {
    const from = new Date();
    const sec = 32;
    const min = 42;
    const to = new Date(from.getTime() + 60 * 1000 * min + sec * 1000);

    const timer = calculateTimer(from, to);

    expect(timer).toEqual(`00:${min}:${sec}`);
  });
});
