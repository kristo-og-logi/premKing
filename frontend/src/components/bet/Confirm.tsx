import React from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { submitBet } from '../../redux/reducers/betReducer';
import { colors } from '../../styles/styles';
import type { Bet } from '../../types/Bet';
import { GameweekStatus } from '../../types/Gameweek';
import { getGameweekStatus } from '../../utils/leagueUtils';
import PremButton from '../basic/PremButton';

interface Props {
  selectedGW: number;
  bet: Bet[];
  setBet: (b: Bet[]) => void;
}

enum GWStatus {
  MISSING = 'Missed bet',
  PLACED = 'Bet placed',
  OPEN = 'Confirm',
  LOCKED = 'Locked',
}

export const Confirm = ({ selectedGW, bet, setBet }: Props) => {
  const gameweekSlice = useAppSelector((state) => state.gameweek);
  const fixtureSlice = useAppSelector((state) => state.fixtures);
  const betSlice = useAppSelector((state) => state.bets);
  const authSlice = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const gwStatus = getGameweekStatus(gameweekSlice.allGameweeks[selectedGW - 1]);

  const selectedGWIsCurrentAndOpen = selectedGW == gameweekSlice.currentGameweek && gwStatus === GameweekStatus.OPEN;
  const selectedGWIsInPastOrClosed = selectedGW < gameweekSlice.currentGameweek || gwStatus === GameweekStatus.CLOSED;

  if (betSlice.isLoading)
    return (
      <PremButton fullWidth disabled onPress={() => {}}>
        loading...
      </PremButton>
    );

  return selectedGWIsInPastOrClosed ? (
    <PremButton
      extraStyles={{
        backgroundColor: betSlice.bets[selectedGW - 1].bets.length === 0 ? colors.red : colors.green,
      }}
      fullWidth
      disabled={true}
      onPress={() => {}}
    >
      {betSlice.bets[selectedGW - 1].bets.length === 0 ? GWStatus.MISSING : GWStatus.PLACED}
    </PremButton>
  ) : selectedGWIsCurrentAndOpen ? (
    <PremButton
      extraStyles={
        betSlice.bets[betSlice.selectedGameweek - 1].bets.length > 0 ? { backgroundColor: colors.green } : undefined
      }
      fullWidth
      disabled={fixtureSlice.fixtures.length > bet.length || betSlice.bets[selectedGW - 1].bets.length > 0}
      onPress={() => {
        dispatch(submitBet({ bets: bet, gameweek: selectedGW, token: authSlice.token }));
        setBet([]);
      }}
    >
      {betSlice.bets[betSlice.selectedGameweek - 1].bets.length > 0
        ? GWStatus.PLACED
        : betSlice.createBetIsLoading
          ? 'Loading...'
          : betSlice.createBetHasError
            ? 'Error :('
            : GWStatus.OPEN}
    </PremButton>
  ) : (
    <PremButton fullWidth disabled={true} onPress={() => {}}>
      {GWStatus.LOCKED}
    </PremButton>
  );
};
