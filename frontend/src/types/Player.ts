import Score from './Scores';

export type Player = {
  id: string;
  name: string;
  username: string;
  email?: string;
  scores: Score[];
};
