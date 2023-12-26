import React from 'react';
import { View } from 'react-native';
import { globalStyles } from '../../../styles/styles';
import PremText from '../../../components/basic/PremText';
// import { router } from 'expo-router';
import PremButton from '../../../components/basic/PremButton';
import { useRouter } from 'expo-router';

const Stats = () => {
  const router = useRouter();
  return (
    <View style={globalStyles.container}>
      <PremText>Some stats</PremText>
      <PremButton
        onPress={() => {
          router.replace('/login');
        }}
      >
        Logout
      </PremButton>
    </View>
  );
};

export default Stats;
