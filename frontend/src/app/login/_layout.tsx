import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
// import PremText from '../../components/basic/PremText';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const Login = () => {
  return (
    <SafeAreaView>
      <Text>Login screen</Text>
      <Link href="/main" asChild>
        <TouchableOpacity onPress={() => console.log('navigate to main page')}>
          <Text>Login</Text>
        </TouchableOpacity>
      </Link>
    </SafeAreaView>
  );
};

export default Login;
