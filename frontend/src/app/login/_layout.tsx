import React, { useEffect } from 'react';
import { Image, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Google from 'expo-auth-session/providers/google';

import { globalStyles } from '../../styles/styles';
import { useAppDispatch } from '../../redux/hooks';
import { getUsers } from '../../redux/reducers/usersReducer';
import User from '../../types/User';
import GoogleButton from '../../components/GoogleButton';
import { setUser } from '../../redux/reducers/authReducer';

import premkingLogo from '../../../assets/premKingLogo.png';

const Login = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getUsers());
  }, []);

  const [_, response, promptAsync] = Google.useAuthRequest({
    iosClientId: '538791218868-3occqdqicf7o6qsspdfu2731811jt4k8.apps.googleusercontent.com',
  });

  const handleOauth = async () => {
    if (response?.type === 'success') {
      console.log('oauth success: ', response.authentication?.accessToken);
      const user = await getUser(response.authentication?.accessToken);

      if (user) {
        dispatch(setUser(user));
        router.replace('/');
      }
    }
  };

  const getUser = async (token?: string): Promise<User | undefined> => {
    if (!token) {
      console.log('No token');
      return;
    }
    try {
      const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const user = await response.json();
      console.log('User: ', user);

      const newUser: User = {
        id: user.id,
        username: user.name,
        name: user.name,
        token: token,
        email: user.email,
      };
      return newUser;
    } catch (error) {
      console.log('ERROR fetching user data');
    }
  };

  useEffect(() => {
    handleOauth();
  }, [response]);

  return (
    <SafeAreaView style={{ ...globalStyles.container, justifyContent: 'space-between' }}>
      {/* <PremText centered order={1}>
        PremKing
      </PremText> */}
      <View>
        <Image
          source={premkingLogo}
          // height={1}
          // width={0.8}
          style={{ width: 'auto', height: 200 }}
        />
      </View>

      <View style={{ display: 'flex', gap: 8 }}>
        <GoogleButton onPress={() => promptAsync()} />
      </View>
    </SafeAreaView>
  );
};

export default Login;
