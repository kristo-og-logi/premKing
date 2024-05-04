import { Player } from './Player';
import User from './User';

export type League = { id: string; name: string; users: User[] };
export type SelectedLeague = { id: string; name: string; ownerId: string; players: Player[] };
