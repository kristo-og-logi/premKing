import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useAppSelector } from '../../../redux/hooks';
import { Bet } from '../../../types/Bet';
import PastMatchUp from './PastMatchUp';

const PastGameweekBet = () => {
  const fixtureSlice = useAppSelector((state) => state.fixtures);
  const betSlice = useAppSelector((state) => state.bets);
  const bets: Bet[] = betSlice.bets;

  return (
    <View style={styles.fixtureList}>
      {fixtureSlice.fixtures.map((fixture) => (
        <PastMatchUp
          bet={bets.find((b) => b.fixtureId === fixture.id)}
          key={fixture.id}
          fixture={fixture}
        />
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
