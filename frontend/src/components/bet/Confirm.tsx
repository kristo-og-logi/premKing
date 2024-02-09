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

  const selectedGWIsCurrent = selectedGW == gameweekSlice.gameweek;
  const selectedGWIsInPast = selectedGW < gameweekSlice.gameweek;

  return (
    <PremButton
      extraStyles={selectedGWIsInPast ? { backgroundColor: colors.red } : undefined}
      fullWidth
      disabled={!selectedGWIsCurrent || fixtureSlice.fixtures.length > bet.length}
      onPress={() => console.log('bet placed')}
    >
      {selectedGWIsCurrent ? 'Confirm' : selectedGWIsInPast ? 'Missing bet' : 'Locked'}
    </PremButton>
  );
};
