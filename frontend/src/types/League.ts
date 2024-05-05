import { Player } from './Player';

export type League = {
  id: string;
  name: string;
  ownerId: string;
  members: number;
  position: number;
};
export type SelectedLeague = { id: string; name: string; ownerId: string; users: Player[] };
