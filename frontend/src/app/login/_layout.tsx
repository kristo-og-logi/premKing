import React, { useEffect } from 'react';
import { Image, TextInput, View } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Google from 'expo-auth-session/providers/google';
import * as SecureStore from 'expo-secure-store';

import { globalStyles } from '../../styles/styles';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import GoogleButton from '../../components/GoogleButton';
import { login } from '../../redux/reducers/authReducer';

import premkingLogo from '../../../assets/premKingLogo.png';
import PremButton from '../../components/basic/PremButton';
import PremText from '../../components/basic/PremText';

const save = async (key: string, value: string) => {
  await SecureStore.setItemAsync(key, value);
};

const getValueFor = async (key: string) => {
  const result = await SecureStore.getItemAsync(key);
  if (result) {
    alert("🔐 Here's your value 🔐 \n" + result);
  } else {
    alert('No values stored under that key.');
  }
};

const Login = () => {
  const [key, onChangeKey] = React.useState('USER');
  const [value, onChangeValue] = React.useState('YourValueHere');

  const router = useRouter();
  const dispatch = useAppDispatch();
  const authSlice = useAppSelector((state) => state.auth);

  const [_, response, promptAsync] = Google.useAuthRequest({
    iosClientId: '538791218868-3occqdqicf7o6qsspdfu2731811jt4k8.apps.googleusercontent.com',
  });

  const handleOauth = async () => {
    if (response?.type === 'success') {
      console.log('oauth success: ', response.authentication?.accessToken);

      if (response.authentication?.accessToken)
        dispatch(login(response.authentication?.accessToken));

      router.replace('/');
    }
  };

  useEffect(() => {
    handleOauth();
  }, [response]);

  if (authSlice.user) return <Redirect href={'/leagues'} />;

  return (
    <SafeAreaView style={{ ...globalStyles.container, justifyContent: 'space-between' }}>
      <View>
        <Image source={premkingLogo} style={{ width: 'auto', height: 200 }} />
      </View>

      {/* <View style={{ display: 'flex', gap: 8 }}>
        <GoogleButton onPress={() => promptAsync()} />
      </View> */}
      <View>
        <PremText>Save an item, and grab it later!</PremText>
        <PremButton
          onPress={() => {
            save(key, value);
          }}
        >
          Save
        </PremButton>
        <PremText>🔐 Enter your key 🔐</PremText>
        <TextInput
          onSubmitEditing={(event) => {
            getValueFor(event.nativeEvent.text);
          }}
          placeholder="Enter the key for the value you want to get"
        />
      </View>
    </SafeAreaView>
  );
};

export default Login;
