import React from 'react';
import { View } from 'react-native';
import { globalStyles } from '../../../styles/styles';
import PremText from '../../../components/basic/PremText';
import { Link } from 'expo-router';
import PremButton from '../../../components/basic/PremButton';

const Stats = () => {
  return (
    <View style={globalStyles.container}>
      <PremText>Some stats</PremText>
      <Link href={'/login'} asChild>
        <PremButton onPress={() => console.log('logging out')}>Logout</PremButton>
      </Link>
    </View>
  );
};

export default Stats;
