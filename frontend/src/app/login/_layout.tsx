import React, { useEffect, useState } from 'react';
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
import { getTokenFromStorage, saveTokenInStorage } from '../../utils/storage';
import PremTextInput from '../../components/basic/PremTextInput';

const deletedValueFor = async (key: string) => {
  await SecureStore.deleteItemAsync(key);
  alert('Value deleted');
};

const Login = () => {
  const [tokenValue, setTokenValue] = useState<string>('');

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
        <PremTextInput placeholder="token value" onChangeText={setTokenValue} value={tokenValue} />
        <PremButton
          onPress={() => {
            console.log('saving value1');
            saveTokenInStorage(tokenValue);
            console.log('saving value2');
          }}
        >
          Save "TOKEN: VALUE"
        </PremButton>
        <PremButton
          onPress={async () => {
            console.log('getting value1');
            const token = await getTokenFromStorage();
            alert(`token is ${token}`);
            console.log('getting value2');
          }}
        >
          GET "TOKEN"
        </PremButton>
        <PremButton
          onPress={() => {
            console.log('deleting value1');
            deletedValueFor('TOKEN');
            console.log('deleting value2');
          }}
        >
          REMOVE "TOKEN"
        </PremButton>
      </View>
    </SafeAreaView>
  );
};

export default Login;
