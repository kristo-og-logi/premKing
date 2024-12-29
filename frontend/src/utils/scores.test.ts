import { describe, expect, test } from '@jest/globals';
import type { Ticket } from '../types/Bet';
import type Gameweek from '../types/Gameweek';
import type Score from '../types/Scores';
import { getMyScore } from './scores';

const testInput_getMyScore = (): {
  scoreIsLoading: boolean;
  score: Score;
  betIsLoading: boolean;
  ticket: Ticket;
  currentGW: number;
  gameweek: Gameweek;
  selectedGW: number;
} => {
  return {
    scoreIsLoading: false,
    score: { gameweek: 1, score: 50, total: 1500, place: 1 },
    betIsLoading: false,
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
    test('getMyScore handles loading with both loadings set', () => {
      const { score, ticket, currentGW, gameweek, selectedGW } = testInput_getMyScore();
      const scoreIsLoading = true;
      const betIsLoading = true;

      const myScore = getMyScore(scoreIsLoading, score, betIsLoading, ticket, currentGW, gameweek, selectedGW);
      expect(myScore).toEqual('...');
    });

    test('getMyScore handles loading with either loading set', () => {
      const { score, ticket, currentGW, gameweek, selectedGW } = testInput_getMyScore();
      let scoreIsLoading = false;
      let betIsLoading = true;

      let myScore = getMyScore(scoreIsLoading, score, betIsLoading, ticket, currentGW, gameweek, selectedGW);
      expect(myScore).toEqual('...');

      scoreIsLoading = true;
      betIsLoading = false;

      myScore = getMyScore(scoreIsLoading, score, betIsLoading, ticket, currentGW, gameweek, selectedGW);
      expect(myScore).toEqual('...');
    });

    test('getMyScore handles loading with all other variables undefined', () => {
      const scoreIsLoading = true;
      const betIsLoading = true;

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

      const myScore = getMyScore(scoreIsLoading, score, betIsLoading, ticket, currentGW, gameweek, selectedGW);
      expect(myScore).toEqual('...');
    });
  });

  describe('unknown', () => {
    test('getMyScore displays future gameweeks with unknown', () => {
      const { scoreIsLoading, score, betIsLoading, ticket, gameweek } = testInput_getMyScore();
      const currentGW = 20;
      const selectedGW = currentGW + 1; // more than currentGW

      const myScore = getMyScore(scoreIsLoading, score, betIsLoading, ticket, currentGW, gameweek, selectedGW);
      expect(myScore).toEqual('??');
    });

    test('getMyScore displays current, open gameweeks with unknown', () => {
      const { scoreIsLoading, score, betIsLoading, ticket, currentGW, selectedGW } = testInput_getMyScore();

      const gameweek: Gameweek = {
        gameweek: 1,
        opens: new Date(new Date().getTime() - 60 * 60 * 1000).toISOString(), // date of an hour ago
        closes: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(), // date of in an hour
        finishes: new Date(new Date().getTime() + 2 * 60 * 60 * 1000).toISOString(), // date of in two hours
        isFinished: false,
        fixtures: [],
        hasFixtures: false,
      };

      const myScore = getMyScore(scoreIsLoading, score, betIsLoading, ticket, currentGW, gameweek, selectedGW);
      expect(myScore).toEqual('??');
    });
  });
});
