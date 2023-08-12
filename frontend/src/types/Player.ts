export type Player = {
  id: string;
  name: string;
  points: PlayerPoints[];
};

export type PlayerPoints = {
  gw: number;
  points: number;
};

export type ScoreboardPlayer = {
  id: string;
  name: string;
  points: number;
  prevPoints: number;
  posChange: number;
};
