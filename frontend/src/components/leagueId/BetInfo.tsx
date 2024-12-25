import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useAppSelector } from '../../redux/hooks';
import type { Bet } from '../../types/Bet';
import { GameweekStatus } from '../../types/Gameweek';
import { calculateGwAction, calculateTimeUntilGW, getGameweekStatus } from '../../utils/leagueUtils';
import PremButton from '../basic/PremButton';
import PremText from '../basic/PremText';

interface Props {
  selectedGW: number;
  bets: Bet[];
}

const BetInfo = ({ selectedGW, bets }: Props) => {
  const router = useRouter();
  const gameweekSlice = useAppSelector((state) => state.gameweek);
  const gameweekAction = calculateGwAction(gameweekSlice.allGameweeks[selectedGW - 1], bets);

  return (
    <View style={styles.betWrapper}>
      <PremText centered>{calculateTimeUntilGW(gameweekSlice.allGameweeks[selectedGW - 1])}</PremText>
      <PremButton
        disabled={
          !(getGameweekStatus(gameweekSlice.allGameweeks[selectedGW - 1]) === GameweekStatus.OPEN && bets.length === 0)
        }
        onPress={() => {
          router.replace('bet');
        }}
      >
        {gameweekAction}
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
