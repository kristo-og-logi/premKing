import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import {
  calculateTimeUntilGW,
  calculateGwAction,
  getGameweekStatus,
} from '../../utils/leagueUtils';
import PremButton from '../basic/PremButton';
import PremText from '../basic/PremText';
import { useAppSelector } from '../../redux/hooks';
import { Bet } from '../../types/Bet';
import { GameweekStatus } from '../../types/Gameweek';

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
      <PremText centered>
        {calculateTimeUntilGW(gameweekSlice.allGameweeks[selectedGW - 1])}
      </PremText>
      <PremButton
        disabled={
          !(
            getGameweekStatus(gameweekSlice.allGameweeks[selectedGW - 1]) === GameweekStatus.OPEN &&
            bets.length === 0
          )
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
