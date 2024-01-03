import React, { useEffect, useState } from 'react';
import { FlatList, View, TouchableHighlight } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, globalStyles } from '../../styles/styles';
import PremText from '../../components/basic/PremText';
import PremButton from '../../components/basic/PremButton';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getUsers, setUser } from '../../redux/reducers/userReducer';
import User from '../../types/User';

const Login = () => {
  const router = useRouter();
  const userSlice = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const [selectedUserId, setSelectedUserId] = useState<string>();
  useEffect(() => {
    dispatch(getUsers());
  }, []);

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
      <View style={[globalStyles.centered]}>
        <PremButton
          onPress={() => {
            const selectedUser: User | undefined = userSlice.users.find(
              (u) => u.ID === selectedUserId
            );
            if (selectedUser) {
              dispatch(setUser(selectedUser));
              router.replace('/main');
            }
          }}
          disabled={!selectedUserId}
        >
          Login
        </PremButton>
      </View>
    </SafeAreaView>
  );
};

export default Login;
