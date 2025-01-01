import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useAppSelector } from '../../redux/hooks';
import { colors, globalStyles } from '../../styles/styles';
import { getMyScore } from '../../utils/scores';
import PremText from '../basic/PremText';

interface Props {
  selectedGW: number;
}

const Scores = ({ selectedGW }: Props) => {
  const scoreSlice = useAppSelector((state) => state.scores);
  const betSlice = useAppSelector((state) => state.bets);
  const gameweekSlice = useAppSelector((state) => state.gameweek);

  return (
    <View style={[styles.gwScores]}>
      <View style={[styles.secondaryCard, globalStyles.shadow]}>
        <PremText order={4}>Total</PremText>
        <PremText>
          {scoreSlice.hasError
            ? 'error'
            : scoreSlice.isLoading
              ? '...'
              : `x${scoreSlice.scores[selectedGW - 1]?.total.toFixed(2) || '?.??'}`}
        </PremText>
      </View>

      <View style={[styles.mainCard, globalStyles.shadow]}>
        <PremText>My score</PremText>
        <PremText order={2}>
          {getMyScore(
            scoreSlice.isLoading || betSlice.isLoading,
            scoreSlice.hasError || betSlice.hasError,
            scoreSlice.scores[selectedGW - 1],
            betSlice.bets[selectedGW - 1],
            gameweekSlice.currentGameweek,
            gameweekSlice.allGameweeks[selectedGW - 1],
            selectedGW,
          )}
        </PremText>
      </View>
      {/* <View style={[styles.secondaryCard, globalStyles.shadow]}>
      <PremText order={4}>Max</PremText>
      <PremText order={3}>x12.19</PremText>
    </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  gwScores: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginVertical: 12,
  },
  mainCard: {
    height: 72,
    width: 108,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.charcoal[3],
    borderRadius: 4,
  },
  secondaryCard: {
    height: 60,
    width: 80,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.charcoal[2],
    borderRadius: 4,
  },
});

export default Scores;
