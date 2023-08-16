import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { colors } from '../../styles/styles';
import { MatchUp } from '../../components/bet/MatchUp';
import { Gameweek } from '../../components/bet/Gameweek';
import { Confirm } from '../../components/bet/Confirm';

const Bet = () => {
  return (
    <View style={styles.container}>
      <Gameweek />
      <ScrollView>
        <MatchUp />
        <MatchUp />
        <MatchUp />
        <MatchUp />
        <MatchUp />
        <MatchUp />
        <MatchUp />
      </ScrollView>
      <Confirm />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.charcoal[1],
    padding: 16,
  },

  scrollContainer: {
    flex: 1,
    backgroundColor: colors.charcoal[1],
    padding: 16,
    height: 100,
  },
});

export default Bet;
