import Score from './Scores';

export type Player = {
  id: string;
  name: string;
  scores: Score[];
};

export type ScoreboardPlayer = {
  id: string;
  name: string;
  points: number;
  prevPoints: number;
  posChange: number;
  position: number;
  prevPosition: number;
};
