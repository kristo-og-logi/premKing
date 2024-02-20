import React from 'react';
import { useAppSelector } from '../../redux/hooks';
import PremButton from '../basic/PremButton';
import { colors } from '../../styles/styles';
import { Bet } from '../../types/Bet';

interface Props {
  selectedGW: number;
  bet: Bet[];
}

export const Confirm = ({ selectedGW, bet }: Props) => {
  const gameweekSlice = useAppSelector((state) => state.gameweek);
  const fixtureSlice = useAppSelector((state) => state.fixtures);
  const betSlice = useAppSelector((state) => state.bets);

  const selectedGWIsCurrent = selectedGW == gameweekSlice.gameweek;
  const selectedGWIsInPast = selectedGW < gameweekSlice.gameweek;

  return selectedGWIsInPast ? (
    <PremButton
      extraStyles={betSlice.notFound ? { backgroundColor: colors.red } : undefined}
      fullWidth
      disabled={true}
      onPress={() => console.log('bet placed')}
    >
      {betSlice.notFound ? 'Missing bet' : 'Bet placed'}
    </PremButton>
  ) : selectedGWIsCurrent ? (
    <PremButton
      fullWidth
      disabled={fixtureSlice.fixtures.length > bet.length}
      onPress={() => console.log('bet placed')}
    >
      {'Confirm'}
    </PremButton>
  ) : (
    <PremButton fullWidth disabled={true} onPress={() => console.log('bet placed')}>
      {'Locked'}
    </PremButton>
  );
};
