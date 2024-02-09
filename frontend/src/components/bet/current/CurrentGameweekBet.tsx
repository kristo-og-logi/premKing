import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useAppSelector } from '../../../redux/hooks';
import { Bet } from '../../../types/Bet';
import MatchUpBet from './CurrentMatchUpBet';

interface Props {
  bet: Bet[];
  setBet: (bet: Bet[]) => void;
}

const CurrentGameweekBet = ({ bet, setBet }: Props) => {
  const fixtureSlice = useAppSelector((state) => state.fixtures);
  return (
    <View style={styles.fixtureList}>
      {fixtureSlice.fixtures.map((fixture) => (
        <MatchUpBet bet={bet} setBet={setBet} key={fixture.id} fixture={fixture} />
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
