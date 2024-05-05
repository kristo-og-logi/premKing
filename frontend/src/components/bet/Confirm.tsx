import React from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import PremButton from '../basic/PremButton';
import { colors } from '../../styles/styles';
import { Bet } from '../../types/Bet';
import { submitBet } from '../../redux/reducers/betReducer';
import { getGameweekStatus } from '../../utils/leagueUtils';
import { GameweekStatus } from '../../types/Gameweek';

interface Props {
  selectedGW: number;
  bet: Bet[];
}

enum GWStatus {
  MISSING = 'Missing bet',
  PLACED = 'Bet placed',
  OPEN = 'Confirm',
  LOCKED = 'Locked',
}

export const Confirm = ({ selectedGW, bet }: Props) => {
  const gameweekSlice = useAppSelector((state) => state.gameweek);
  const fixtureSlice = useAppSelector((state) => state.fixtures);
  const betSlice = useAppSelector((state) => state.bets);
  const authSlice = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const gwStatus = getGameweekStatus(gameweekSlice.allGameweeks[selectedGW - 1]);

  const selectedGWIsCurrentAndOpen =
    selectedGW == gameweekSlice.currentGameweek && gwStatus === GameweekStatus.OPEN;
  const selectedGWIsInPast = selectedGW < gameweekSlice.currentGameweek;

  if (betSlice.isLoading)
    return (
      <PremButton fullWidth disabled onPress={() => {}}>
        loading...
      </PremButton>
    );

  return selectedGWIsInPast ? (
    <PremButton
      extraStyles={{ backgroundColor: betSlice.notFound ? colors.red : colors.green }}
      fullWidth
      disabled={true}
      onPress={() => {}}
    >
      {betSlice.notFound ? GWStatus.MISSING : GWStatus.PLACED}
    </PremButton>
  ) : selectedGWIsCurrentAndOpen ? (
    <PremButton
      extraStyles={
        betSlice.bets[betSlice.selectedGameweek - 1].length > 0
          ? { backgroundColor: colors.green }
          : undefined
      }
      fullWidth
      disabled={
        betSlice.bets[betSlice.selectedGameweek - 1].length > 0 ||
        fixtureSlice.fixtures.length > bet.length
      }
      onPress={() =>
        dispatch(submitBet({ bets: bet, gameweek: selectedGW, token: authSlice.token }))
      }
    >
      {betSlice.bets[betSlice.selectedGameweek - 1].length > 0
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
