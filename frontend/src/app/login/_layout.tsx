import React, { useEffect, useState } from 'react';
import { FlatList, View, TouchableHighlight } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { globalStyles } from '../../styles/styles';
import PremText from '../../components/basic/PremText';
import PremButton from '../../components/basic/PremButton';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getUsers } from '../../redux/reducers/userReducer';

const Login = () => {
  const router = useRouter();
  const userSlice = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const [selectedUser, setSelectedUser] = useState<boolean>(false);
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
            <TouchableHighlight onPress={() => setSelectedUser((currentVal) => !currentVal)}>
              <View
                key={item.item.ID}
                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
              >
                <PremText>{item.item.Name}</PremText>
                <PremText>{`ID: ${item.item.ID.substring(0, 6)}`}</PremText>
              </View>
            </TouchableHighlight>
          )}
        />
      )}
      <View style={[globalStyles.centered]}>
        <PremButton onPress={() => router.replace('/main')} disabled={selectedUser}>
          Login
        </PremButton>
      </View>
    </SafeAreaView>
  );
};

export default Login;
