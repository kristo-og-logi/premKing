import React from 'react';
import { View } from 'react-native';
import { globalStyles } from '../../styles/styles';
import PremText from '../../components/basic/PremText';

const Bet = () => {
  return (
    <View style={globalStyles.container}>
      <PremText>My Bet</PremText>
      <PremText>Gameweek 1</PremText>
    </View>
  );
};

export default Bet;
