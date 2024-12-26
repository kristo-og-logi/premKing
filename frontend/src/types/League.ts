import type { Player } from './Player';

export type League = {
  id: string;
  name: string;
  ownerId: string;
  members: number;
  position: { gameweek: number; position: number }[];
};

export type SelectedLeague = { id: string; name: string; ownerId: string; users: Player[] };
