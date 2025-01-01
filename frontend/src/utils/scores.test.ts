import { describe, expect, test } from '@jest/globals';
import type { Ticket } from '../types/Bet';
import type Gameweek from '../types/Gameweek';
import type Score from '../types/Scores';
import { getMyScore } from './scores';

const testInput_getMyScore = (): {
  isLoading: boolean;
  hasError: boolean;
  score: Score;
  ticket: Ticket;
  currentGW: number;
  gameweek: Gameweek;
  selectedGW: number;
} => {
  return {
    isLoading: false,
    hasError: false,
    score: { gameweek: 1, score: 50, total: 1500, place: 1 },
    ticket: { gameweek: 1, bets: [], score: 0 },
    currentGW: 1,
    gameweek: {
      gameweek: 1,
      opens: 'hmm',
      closes: 'hmm',
      finishes: 'hmm',
      isFinished: false,
      fixtures: [],
      hasFixtures: false,
    },
    selectedGW: 1,
  };
};

describe('getMyScore', () => {
  describe('loading', () => {
    test('getMyScore handles loading', () => {
      const { hasError, score, ticket, currentGW, gameweek, selectedGW } = testInput_getMyScore();
      const isLoading = true;

      const myScore = getMyScore(isLoading, hasError, score, ticket, currentGW, gameweek, selectedGW);
      expect(myScore).toEqual('...');
    });

    test('getMyScore handles loading with all other variables undefined', () => {
      const isLoading = true;

      // @ts-ignore
      const hasError: boolean = undefined;
      // @ts-ignore
      const score: Score = undefined;
      // @ts-ignore
      const ticket: Ticket = undefined;
      // @ts-ignore
      const gameweek: Gameweek = undefined;
      // @ts-ignore
      const currentGW: number = undefined;
      // @ts-ignore
      const selectedGW: number = undefined;

      const myScore = getMyScore(isLoading, hasError, score, ticket, currentGW, gameweek, selectedGW);
      expect(myScore).toEqual('...');
    });
  });

  describe('error', () => {
    test('getMyScore handles error', () => {});
    const { isLoading, score, ticket, currentGW, gameweek, selectedGW } = testInput_getMyScore();
    const hasError = true;

    const myScore = getMyScore(isLoading, hasError, score, ticket, currentGW, gameweek, selectedGW);
    expect(myScore).toEqual('error');

    test('getMyScore handles error with all later variables undefined', () => {
      const isLoading = false;
      const hasError = true;
      // @ts-ignore
      const score: Score = undefined;
      // @ts-ignore
      const ticket: Ticket = undefined;
      // @ts-ignore
      const gameweek: Gameweek = undefined;
      // @ts-ignore
      const currentGW: number = undefined;
      // @ts-ignore
      const selectedGW: number = undefined;

      const myScore = getMyScore(isLoading, hasError, score, ticket, currentGW, gameweek, selectedGW);
      expect(myScore).toEqual('error');
    });
  });

  describe('unknown', () => {
    test('getMyScore displays future gameweeks with unknown', () => {
      const { isLoading, hasError, score, ticket, gameweek } = testInput_getMyScore();
      const currentGW = 20;
      const selectedGW = currentGW + 1; // more than currentGW

      const myScore = getMyScore(isLoading, hasError, score, ticket, currentGW, gameweek, selectedGW);
      expect(myScore).toEqual('??');
    });

    test('getMyScore displays current, open gameweeks with unknown', () => {
      const { isLoading, hasError, score, ticket, currentGW, selectedGW } = testInput_getMyScore();

      const gameweek: Gameweek = {
        gameweek: 1,
        opens: new Date(new Date().getTime() - 60 * 60 * 1000).toISOString(), // date of an hour ago
        closes: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(), // date of in an hour
        finishes: new Date(new Date().getTime() + 2 * 60 * 60 * 1000).toISOString(), // date of in two hours
        isFinished: false,
        fixtures: [],
        hasFixtures: false,
      };

      const myScore = getMyScore(isLoading, hasError, score, ticket, currentGW, gameweek, selectedGW);
      expect(myScore).toEqual('??');
    });
  });
});
