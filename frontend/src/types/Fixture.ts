import Team from './Team';

export default interface Fixture {
  id: number;
  homeTeam: Team;
  awayTeam: Team;
  matchDate: string;
  gameWeek: number;
}
