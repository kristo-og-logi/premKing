import Team from './Team';

export enum FixtureResult {
  HOME = '1',
  DRAW = 'X',
  AWAY = '2',
}
export default interface Fixture {
  id: number;
  homeTeam: Team;
  awayTeam: Team;
  gameWeek: number;
  finished: boolean;
  homeGoals: number;
  awayGoals: number;
  result: FixtureResult;
  matchDate: string;
  name: string;
  homeOdds: number;
  drawOdds: number;
  awayOdds: number;
}
