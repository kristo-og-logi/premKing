import Fixture from './Fixture';

export default interface Gameweek {
  gameweek: number;
  opens: string;
  closes: string;
  finishes: string;
  isFinished: boolean;
  hasFixtures: boolean;
  fixtures: Fixture[];
}

export enum GameweekStatus {
  BEFORE,
  OPEN,
  CLOSED,
  FINISHED,
}
