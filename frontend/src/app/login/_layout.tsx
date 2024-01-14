import React, { useEffect } from 'react';
import { Image, View } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Google from 'expo-auth-session/providers/google';

import { globalStyles } from '../../styles/styles';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import GoogleButton from '../../components/GoogleButton';
import { login } from '../../redux/reducers/authReducer';

import premkingLogo from '../../../assets/premKingLogo.png';
import { maybeCompleteAuthSession } from 'expo-web-browser';

maybeCompleteAuthSession();

const Login = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const authSlice = useAppSelector((state) => state.auth);

  const [_, response, promptAsync] = Google.useAuthRequest({
    iosClientId: '538791218868-3occqdqicf7o6qsspdfu2731811jt4k8.apps.googleusercontent.com',
    webClientId: '538791218868-le0ufbps49vd2bthqc0n1bdjhm8al2bf.apps.googleusercontent.com',
    androidClientId: '538791218868-sjkkasc0pr2u56pmc2l3uvmucdkm1mpq.apps.googleusercontent.com',
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

      <View style={{ display: 'flex', gap: 8 }}>
        <GoogleButton onPress={() => promptAsync()} />
      </View>
    </SafeAreaView>
  );
};

export default Login;
