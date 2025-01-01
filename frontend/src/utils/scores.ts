import type { Ticket } from '../types/Bet';
import type Gameweek from '../types/Gameweek';
import { GameweekStatus } from '../types/Gameweek';
import type Score from '../types/Scores';
import { getGameweekStatus } from './leagueUtils';

export const getMyScore = (
  isLoading: boolean,
  hasError: boolean,
  score: Score,
  ticket: Ticket,
  currentGW: number,
  selectedGWObj: Gameweek,
  selectedGW: number,
): string => {
  // waiting for data..
  if (isLoading) return '...';
  if (hasError) return 'error';

  const gwStatus = getGameweekStatus(selectedGWObj);
  const isCurrentGW = selectedGW === currentGW;

  // gameweek has not yet finished
  if (selectedGW > currentGW || (isCurrentGW && gwStatus === GameweekStatus.OPEN)) return '??';
  // no bets were placed for past gameweek
  if (ticket.bets.length === 0) return 'Missed';

  // default: bet placed for past gameweek
  return `x${score.score.toFixed(2)}`;
};
