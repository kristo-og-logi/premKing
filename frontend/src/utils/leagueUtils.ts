import { Bet } from '../types/Bet';
import Gameweek, { GameweekStatus } from '../types/Gameweek';
import { PlayerPoints, Player, ScoreboardPlayer } from '../types/Player';
import User from '../types/User';

export const calculateYourPlace = (players: User[], userId?: string) => {
  return players.findIndex((player) => player.id === userId) + 1;
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
      console.log('before');
      break;
    case GameweekStatus.OPEN:
      console.log('open');
      bets.length > 0 ? (message = BetStatus.PLACED) : (message = BetStatus.OPEN);
      break;
    case GameweekStatus.CLOSED:
      bets.length > 0 ? (message = BetStatus.PLACED) : (message = BetStatus.LOCKED);
      console.log('closed');
      break;
    case GameweekStatus.FINISHED:
      bets.length > 0 ? (message = BetStatus.PLACED) : (message = BetStatus.LOCKED);
      console.log('finished');
      break;
  }

  return message;
};

export const calculateTimeUntilGW = (gameweek: Gameweek) => {
  const now = new Date();
  const opens = new Date(gameweek.opens);
  const closes = new Date(gameweek.closes);
  const finishes = new Date(gameweek.finishes);

  if (now < opens)
    return `Opens on ${opens.toDateString()}, ${opens.getHours()}:${opens.getMinutes().toString().padStart(2, '0')}`;

  if (now < closes) return `Open`;

  if (now < finishes)
    return `Closed on ${closes.toDateString()}, ${closes.getHours()}:${closes.getMinutes().toString().padStart(2, '0')}`;

  if (finishes < now)
    return `Finished on ${finishes.toDateString()}, ${finishes.getHours()}:${finishes.getMinutes().toString().padStart(2, '0')}`;

  return `unknown`;
};

const calculatePoints = (points: PlayerPoints[], gw: number) => {
  return points.reduce((sum, curr) => {
    if (curr.gw > gw) return sum;
    return (sum += curr.points);
  }, 0);
};

type SBPlayer = {
  id: string;
  name: string;
  points: number;
  prevPoints: number;
};

const getScoreboardPlayers = (players: Player[], selectedGw: number): SBPlayer[] => {
  return players.map((player) => {
    const playerPoints = calculatePoints(player.points, selectedGw);
    const playerPrevPoints = calculatePoints(player.points, selectedGw - 1);

    return { id: player.id, name: player.name, points: playerPoints, prevPoints: playerPrevPoints };
  });
};

const getFinalPlayers = (scoreboardPlayers: SBPlayer[], copy: SBPlayer[]) => {
  return scoreboardPlayers.map((player) => {
    const prevPos =
      copy
        .sort((a, b) => (a.prevPoints >= b.prevPoints ? -1 : 1))
        .findIndex((p) => p.id === player.id) + 1;

    const currPos =
      copy.sort((a, b) => (a.points >= b.points ? -1 : 1)).findIndex((p) => p.id === player.id) + 1;

    return { ...player, position: currPos, prevPosition: prevPos, posChange: prevPos - currPos };
  });
};

export const getScoreboardedPlayers = (
  players: Player[],
  selectedGw: number
): ScoreboardPlayer[] => {
  const scoreboardPlayers = getScoreboardPlayers(players, selectedGw);
  const copy = scoreboardPlayers.slice();

  const finalPlayers = getFinalPlayers(scoreboardPlayers, copy);

  return finalPlayers.sort((a, b) => (a.points >= b.points ? -1 : 1));
};
