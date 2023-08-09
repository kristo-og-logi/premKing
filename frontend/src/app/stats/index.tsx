import React from 'react';
import { View } from 'react-native';
import { globalStyles } from '../../styles/styles';
import PremText from '../../components/basic/PremText';

const Stats = () => {
  return (
    <View style={globalStyles.container}>
      <PremText>Some stats</PremText>
    </View>
  );
};

export default Stats;
