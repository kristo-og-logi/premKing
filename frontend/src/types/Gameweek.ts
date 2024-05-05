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
  // Gameweek has not yet opened
  BEFORE,
  // Gameweek is currently open
  OPEN,
  // Gameweek has closed
  CLOSED,
  // Gameweek has finished
  FINISHED,
}
