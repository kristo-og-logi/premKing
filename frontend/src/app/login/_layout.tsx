import React, { useEffect, useState } from 'react';
import { FlatList, View, TouchableHighlight } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Google from 'expo-auth-session/providers/google';

import { colors, globalStyles } from '../../styles/styles';
import PremText from '../../components/basic/PremText';
import PremButton from '../../components/basic/PremButton';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getUsers, setUser } from '../../redux/reducers/userReducer';
import User from '../../types/User';
import GoogleButton from '../../components/GoogleButton';

const Login = () => {
  const router = useRouter();
  const userSlice = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const [selectedUserId, setSelectedUserId] = useState<string>();
  useEffect(() => {
    dispatch(getUsers());
  }, []);

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: '538791218868-3occqdqicf7o6qsspdfu2731811jt4k8.apps.googleusercontent.com',
  });

  const handleOauth = async () => {
    if (response?.type === 'success') {
      console.log('oauth success: ', response.authentication?.accessToken);
      getUser(response.authentication?.accessToken);
    }
  };

  const getUser = async (token?: string) => {
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
      return user;
    } catch (error) {
      console.log('ERROR fetching user data');
    }
  };

  useEffect(() => {
    handleOauth();
  }, [response]);

  return (
    <SafeAreaView style={globalStyles.container}>
      <PremText centered order={1}>
        Login screen
      </PremText>

      {userSlice.usersAreLoading ? (
        <PremText>Loading...</PremText>
      ) : userSlice.users.length === 0 ? (
        <PremText>No users</PremText>
      ) : (
        <FlatList
          data={userSlice.users}
          renderItem={(item) => (
            <TouchableHighlight
              onPress={() =>
                selectedUserId === item.item.ID
                  ? setSelectedUserId('')
                  : setSelectedUserId(item.item.ID)
              }
              style={{ borderRadius: 4, marginBottom: 8 }}
            >
              <View
                key={item.item.ID}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  backgroundColor:
                    selectedUserId === item.item.ID ? colors.charcoal[3] : colors.charcoal[2],
                  padding: 8,
                  borderRadius: 4,
                }}
              >
                <PremText>{item.item.Name}</PremText>
                <PremText>{`ID: ${item.item.ID.substring(0, 6)}`}</PremText>
              </View>
            </TouchableHighlight>
          )}
        />
      )}
      <View style={{ display: 'flex', gap: 8 }}>
        <View style={{ ...globalStyles.centered, marginBottom: 30 }}>
          <PremButton
            onPress={() => {
              const selectedUser: User | undefined = userSlice.users.find(
                (u) => u.ID === selectedUserId
              );
              if (selectedUser) {
                dispatch(setUser(selectedUser));
                router.replace('/');
              }
            }}
            disabled={!selectedUserId}
          >
            Login
          </PremButton>
        </View>
        <GoogleButton onPress={() => promptAsync()} />
      </View>
    </SafeAreaView>
  );
};

export default Login;
