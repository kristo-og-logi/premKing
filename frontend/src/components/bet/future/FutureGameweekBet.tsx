import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useAppSelector } from '../../../redux/hooks';
import FutureMatchUp from './FutureMatchUp';

const FutureGameweekBet = () => {
  const fixtureSlice = useAppSelector((state) => state.fixtures);
  return (
    <View style={styles.fixtureList}>
      {fixtureSlice.fixtures.map((fixture) => (
        <FutureMatchUp key={fixture.id} fixture={fixture} />
      ))}
    </View>
  );
};

export default FutureGameweekBet;

const styles = StyleSheet.create({
  fixtureList: {
    gap: 12,
  },
});
