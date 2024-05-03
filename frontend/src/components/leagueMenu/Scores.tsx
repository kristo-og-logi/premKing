import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import PremText from '../basic/PremText';
import { colors, globalStyles } from '../../styles/styles';

interface Props {
  selectedGW: number;
}

const Scores = ({ selectedGW }: Props) => {
  const [score, setScore] = useState(0);
  useEffect(() => {
    setScore(selectedGW / 13);
    console.log(`fetching scores for GW${selectedGW}`);
  }, [selectedGW]);

  return (
    <View style={[styles.gwScores]}>
      {/* <View style={[styles.secondaryCard, globalStyles.shadow]}>
      <PremText order={4}>Avg</PremText>
      <PremText>x5.12</PremText>
    </View> */}
      <View style={[styles.mainCard, globalStyles.shadow]}>
        <PremText>My score</PremText>
        <PremText order={2}>{`x${score.toFixed(2)}`}</PremText>
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
