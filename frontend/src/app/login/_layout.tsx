import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { globalStyles } from '../../styles/styles';
import PremText from '../../components/basic/PremText';
import PremButton from '../../components/basic/PremButton';

const Login = () => {
  const router = useRouter();
  return (
    <SafeAreaView style={globalStyles.container}>
      <PremText centered order={1}>
        Login screen
      </PremText>
      <View style={[globalStyles.centered]}>
        <PremButton onPress={() => router.replace('/main')}>Login</PremButton>
      </View>
    </SafeAreaView>
  );
};

export default Login;
