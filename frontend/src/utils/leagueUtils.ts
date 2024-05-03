import Gameweek from '../types/Gameweek';
import { PlayerPoints, Player, ScoreboardPlayer } from '../types/Player';
import User from '../types/User';

// const calculateYourPlace = (players: ScoreboardPlayer[], userId: string) => {
//   return players.findIndex((player) => player.id === userId) + 1;
// };
export const calculateYourPlace = (players: User[], userId: string) => {
  return players.findIndex((player) => player.id === userId) + 1;
};

export const calculateGwAction = (gameweek: Gameweek): string => {
  return isOpen(gameweek) ? 'Create bet' : 'Locked';
};

export const isOpen = (gameweek: Gameweek): boolean => {
  const now = new Date();
  const opens = new Date(gameweek.opens);
  const closes = new Date(gameweek.closes);

  return opens < now && now < closes;
};

export const calculateTimeUntilGW = (gameweek: Gameweek) => {
  const now = new Date();
  const opens = new Date(gameweek.opens);
  const closes = new Date(gameweek.closes);
  const finishes = new Date(gameweek.finishes);

  // "now" can be inbetween any of these 3 times, giving us four cases
  // opens - closes - finishes
  if (now < opens)
    return `Opens on ${opens.toDateString()}, ${opens.getHours()}:${opens.getMinutes()}`;

  if (finishes < now)
    return `Finished on ${finishes.toDateString()}, ${finishes.getHours()}:${finishes.getMinutes()}`;

  if (now < closes) return `Closes at ${closes.toDateString()}`;

  return `Closed on ${closes.toDateString()}, ${closes.getHours()}:${closes.getMinutes()}`;
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
