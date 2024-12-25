import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useAppSelector } from '../../../redux/hooks';
import type { Bet } from '../../../types/Bet';
import CurrentMatchUpBet from './CurrentMatchUpBet';

interface Props {
  bet: Bet[];
  setBet: (bet: Bet[]) => void;
}

const CurrentGameweekBet = ({ bet, setBet }: Props) => {
  const fixtureSlice = useAppSelector((state) => state.fixtures);
  return (
    <View style={styles.fixtureList}>
      {fixtureSlice.fixtures.map((fixture) => (
        <CurrentMatchUpBet bet={bet} setBet={setBet} key={fixture.id} fixture={fixture} />
      ))}
    </View>
  );
};

export default CurrentGameweekBet;

const styles = StyleSheet.create({
  fixtureList: {
    gap: 12,
  },
});
