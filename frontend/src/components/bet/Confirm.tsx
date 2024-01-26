import React from 'react';
import { useAppSelector } from '../../redux/hooks';
import PremButton from '../basic/PremButton';
import { colors } from '../../styles/styles';

interface Props {
  selectedGW: number;
}

export const Confirm = ({ selectedGW }: Props) => {
  const gameweekSlice = useAppSelector((state) => state.gameweek);

  const selectedGWIsCurrent = selectedGW == gameweekSlice.gameweek;
  const selectedGWIsInPast = selectedGW < gameweekSlice.gameweek;

  return (
    <PremButton
      extraStyles={selectedGWIsInPast ? { backgroundColor: colors.red } : undefined}
      fullWidth
      disabled={!selectedGWIsCurrent}
      onPress={() => console.log('bet placed')}
    >
      {selectedGWIsCurrent ? 'Confirm' : selectedGWIsInPast ? 'Missing bet' : 'Locked'}
    </PremButton>
  );
};
