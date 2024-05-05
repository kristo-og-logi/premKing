import { Bet } from '../types/Bet';
import Gameweek, { GameweekStatus } from '../types/Gameweek';
import { Player } from '../types/Player';
import { dateFormatter } from './constants';

export const calculateYourPlace = (players: Player[], gw: number, userId?: string): string => {
  const me = players.find((p) => p.id === userId);
  return me ? me.scores[gw - 1].place.toString() : '?';
};

export const getGameweekStatus = (gameweek: Gameweek): GameweekStatus => {
  const now = new Date();
  const opens = new Date(gameweek.opens);
  const closes = new Date(gameweek.closes);
  const finishes = new Date(gameweek.finishes);

  // "now" can be inbetween any of these 3 times, giving us four cases
  // (1) opens (2) closes (3) finishes (4)
  if (now < opens) return GameweekStatus.BEFORE;
  if (now < closes) return GameweekStatus.OPEN;
  if (now < finishes) return GameweekStatus.CLOSED;

  return GameweekStatus.FINISHED;
};

export enum BetStatus {
  PLACED = 'Bet placed',
  MISSED = 'Bet missed',
  OPEN = 'Place bet',
  LOCKED = 'Locked',
  UNKNOWN = 'Unknown',
}

export const calculateGwAction = (gameweek: Gameweek, bets: Bet[]): BetStatus => {
  const gwStatus = getGameweekStatus(gameweek);
  let message = BetStatus.UNKNOWN;

  switch (gwStatus) {
    case GameweekStatus.BEFORE:
      message = BetStatus.LOCKED;
      break;
    case GameweekStatus.OPEN:
      bets.length > 0 ? (message = BetStatus.PLACED) : (message = BetStatus.OPEN);
      break;
    case GameweekStatus.CLOSED:
      bets.length > 0 ? (message = BetStatus.PLACED) : (message = BetStatus.LOCKED);
      break;
    case GameweekStatus.FINISHED:
      bets.length > 0 ? (message = BetStatus.PLACED) : (message = BetStatus.LOCKED);
      break;
  }

  return message;
};

export const calculateTimeUntilGW = (gameweek: Gameweek) => {
  const now = new Date();
  const opens = new Date(gameweek.opens);
  const closes = new Date(gameweek.closes);
  const finishes = new Date(gameweek.finishes);

  if (now < opens) return `Opens on ${dateFormatter.format(opens)}`;
  if (now < closes) return `Open`;
  if (now < finishes) return `Ongoing`;
  if (finishes < now) return `Finished on ${dateFormatter.format(finishes)}`;

  return `unknown`;
};
