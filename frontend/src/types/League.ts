import { Player } from './Player';

export type League = { id: string; name: string; place: number; total: number };
export type SelectedLeague = { id: string; ame: string; players: Player[] };
