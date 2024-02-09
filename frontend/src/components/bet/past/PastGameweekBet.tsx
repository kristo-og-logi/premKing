import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useAppSelector } from '../../../redux/hooks';
import { Bet } from '../../../types/Bet';
import PastMatchUp from './PastMatchUp';

const PastGameweekBet = () => {
  const fixtureSlice = useAppSelector((state) => state.fixtures);

  const bet: Bet[] = [];
  return (
    <View style={styles.fixtureList}>
      {fixtureSlice.fixtures.map((fixture) => (
        <PastMatchUp bet={bet} key={fixture.id} fixture={fixture} />
      ))}
    </View>
  );
};

export default PastGameweekBet;

const styles = StyleSheet.create({
  fixtureList: {
    gap: 12,
  },
});
