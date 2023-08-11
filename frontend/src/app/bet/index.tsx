import React from 'react';
import { View } from 'react-native';
import { globalStyles } from '../../styles/styles';
import { MatchUp } from '../../components/bet/MatchUp';
import { Gameweek } from '../../components/bet/Gameweek';
import { Confirm } from '../../components/bet/Confirm';

const Bet = () => {
  return (
    <View style={globalStyles.container}>
      <Gameweek />
      <MatchUp />
      <MatchUp />
      <Confirm />
    </View>
  );
};

export default Bet;
