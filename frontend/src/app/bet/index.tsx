import React from 'react';
import { View, ScrollView } from 'react-native';
import { globalStyles } from '../../styles/styles';
import { MatchUp } from '../../components/bet/MatchUp';
import { Gameweek } from '../../components/bet/Gameweek';
import { Confirm } from '../../components/bet/Confirm';

const Bet = () => {
  return (
    <View style={globalStyles.container}>
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

export default Bet;
