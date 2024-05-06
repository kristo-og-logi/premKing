import { FixtureResult } from './Fixture';

export interface Bet {
  fixtureId: number;
  result: FixtureResult;
  odd: number;
  won: boolean;
}

export interface Ticket {
  gameweek: number;
  bets: Bet[];
  score: number;
}
