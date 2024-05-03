import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { calculateTimeUntilGW, isOpen, calculateGwAction } from '../../utils/leagueUtils';
import PremButton from '../basic/PremButton';
import PremText from '../basic/PremText';
import { useAppSelector } from '../../redux/hooks';

interface Props {
  selectedGW: number;
}

const BetInfo = ({ selectedGW }: Props) => {
  const router = useRouter();
  const gameweekSlice = useAppSelector((state) => state.gameweek);

  return (
    <View style={styles.betWrapper}>
      <PremText centered>
        {calculateTimeUntilGW(gameweekSlice.allGameweeks[selectedGW - 1])}
      </PremText>
      <PremButton
        disabled={!isOpen(gameweekSlice.allGameweeks[selectedGW - 1])}
        onPress={() => {
          router.replace('bet');
        }}
      >
        {calculateGwAction(gameweekSlice.allGameweeks[selectedGW - 1])}
      </PremButton>
    </View>
  );
};

const styles = StyleSheet.create({
  betWrapper: {
    padding: 12,
    display: 'flex',
    gap: 4,
    alignItems: 'center',
  },
});

export default BetInfo;
