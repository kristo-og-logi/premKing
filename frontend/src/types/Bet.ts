import type { FixtureResult } from './Fixture';
import type User from './User';

export interface Bet {
    fixtureId: number;
    result: FixtureResult;
    odd: number;
    won: boolean;
}

export interface Ticket {
    gameweek: number;
    bets: Bet[];
    score: number;
}

export interface FriendBets {
    friend: User;
    tickets: Ticket[];
}
