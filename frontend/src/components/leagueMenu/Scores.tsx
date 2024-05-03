import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';

import PremText from '../basic/PremText';
import { colors, globalStyles } from '../../styles/styles';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getScore } from '../../redux/reducers/scoreReducer';

interface Props {
  selectedGW: number;
}

const Scores = ({ selectedGW }: Props) => {
  const token = useAppSelector((state) => state.auth).token;
  const scoreSlice = useAppSelector((state) => state.scores);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getScore({ gameweek: selectedGW, token }));
  }, [selectedGW]);

  return (
    <View style={[styles.gwScores]}>
      {/* <View style={[styles.secondaryCard, globalStyles.shadow]}>
      <PremText order={4}>Avg</PremText>
      <PremText>x5.12</PremText>
    </View> */}
      <View style={[styles.mainCard, globalStyles.shadow]}>
        <PremText>My score</PremText>
        <PremText order={2}>
          {scoreSlice.isLoading
            ? '...'
            : scoreSlice.score === -1
              ? '??'
              : `x${scoreSlice.score.toFixed(2)}`}
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
});

export default Scores;
