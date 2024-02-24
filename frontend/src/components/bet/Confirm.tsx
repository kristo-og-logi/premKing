import React from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import PremButton from '../basic/PremButton';
import { colors } from '../../styles/styles';
import { Bet } from '../../types/Bet';
import { submitBet } from '../../redux/reducers/betReducer';

interface Props {
  selectedGW: number;
  bet: Bet[];
}

export const Confirm = ({ selectedGW, bet }: Props) => {
  const gameweekSlice = useAppSelector((state) => state.gameweek);
  const fixtureSlice = useAppSelector((state) => state.fixtures);
  const betSlice = useAppSelector((state) => state.bets);
  const authSlice = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const selectedGWIsCurrent = selectedGW == gameweekSlice.gameweek;
  const selectedGWIsInPast = selectedGW < gameweekSlice.gameweek;

  return selectedGWIsInPast ? (
    <PremButton
      extraStyles={{ backgroundColor: betSlice.notFound ? colors.red : colors.green }}
      fullWidth
      disabled={true}
      onPress={() => {}}
    >
      {betSlice.notFound ? 'Missing bet' : 'Bet placed'}
    </PremButton>
  ) : selectedGWIsCurrent ? (
    <PremButton
      extraStyles={betSlice.bets.length > 0 ? { backgroundColor: colors.green } : undefined}
      fullWidth
      disabled={betSlice.bets.length > 0 || fixtureSlice.fixtures.length > bet.length}
      onPress={() =>
        dispatch(submitBet({ bets: bet, gameweek: selectedGW, token: authSlice.token }))
      }
    >
      {betSlice.bets.length > 0
        ? 'Bet placed'
        : betSlice.createBetIsLoading
          ? 'Loading...'
          : betSlice.createBetHasError
            ? 'Error :('
            : 'Confirm'}
    </PremButton>
  ) : (
    <PremButton fullWidth disabled={true} onPress={() => {}}>
      {'Locked'}
    </PremButton>
  );
};
