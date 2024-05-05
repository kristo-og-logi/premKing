import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';

import PremText from '../basic/PremText';
import { colors, globalStyles } from '../../styles/styles';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchScores } from '../../redux/reducers/scoreReducer';

interface Props {
  selectedGW: number;
}

const Scores = ({ selectedGW }: Props) => {
  const token = useAppSelector((state) => state.auth).token;
  const scoreSlice = useAppSelector((state) => state.scores);
  const betSlice = useAppSelector((state) => state.bets);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchScores(token));
  }, []);

  return (
    <View style={[styles.gwScores]}>
      <View style={[styles.secondaryCard, globalStyles.shadow]}>
        <PremText order={4}>Total</PremText>
        <PremText>
          {scoreSlice.isLoading ? '...' : `x${scoreSlice.scores[selectedGW - 1].total.toFixed(2)}`}
        </PremText>
      </View>
      <View style={[styles.mainCard, globalStyles.shadow]}>
        <PremText>My score</PremText>
        <PremText order={2}>
          {scoreSlice.isLoading || scoreSlice.scores[selectedGW - 1] === undefined
            ? '...'
            : betSlice.bets[selectedGW - 1].length === 0
              ? 'Missed'
              : `x${scoreSlice.scores[selectedGW - 1].score.toFixed(2)}`}
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
