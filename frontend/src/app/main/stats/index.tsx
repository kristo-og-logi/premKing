import React from 'react';
import { View } from 'react-native';
import { globalStyles } from '../../../styles/styles';
import PremText from '../../../components/basic/PremText';
// import { router } from 'expo-router';
import PremButton from '../../../components/basic/PremButton';
import { useRouter } from 'expo-router';
import { useAppSelector } from '../../../redux/hooks';

const Stats = () => {
  const userSlice = useAppSelector((state) => state.user);
  const router = useRouter();
  return (
    <View style={globalStyles.container}>
      <PremText>Some stats</PremText>
      <PremText>{`You are: ${userSlice.user?.Name}`}</PremText>
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
