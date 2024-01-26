import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../styles/styles';
import PremText from '../basic/PremText';
import { useAppSelector } from '../../redux/hooks';
import PremButton from '../basic/PremButton';

interface Props {
  selectedGW: number;
}

export const Confirm = ({ selectedGW }: Props) => {
  const gameweekSlice = useAppSelector((state) => state.gameweek);

  const selectedGWIsCurrent = selectedGW == gameweekSlice.gameweek;

  return (
    <PremButton fullWidth disabled={!selectedGWIsCurrent} onPress={() => console.log('bet placed')}>
      {selectedGWIsCurrent ? 'Confirm' : 'Disabled'}
    </PremButton>
  );
};
