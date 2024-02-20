import { FixtureResult } from './Fixture';

export interface Bet {
  fixtureId: number;
  result: FixtureResult;
  won?: boolean;
}
