import type Fixture from './Fixture';

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
  BEFORE = 0,
  // Gameweek is currently open
  OPEN = 1,
  // Gameweek has closed
  CLOSED = 2,
  // Gameweek has finished
  FINISHED = 3,
}
