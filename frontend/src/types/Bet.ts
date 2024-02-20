import { FixtureResult } from './Fixture';

export interface Bet {
  fixtureId: number;
  bet: FixtureResult;
  won?: boolean;
}
