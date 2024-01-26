import React from 'react';
import { View } from 'react-native';
import { globalStyles } from '../../../styles/styles';
import PremText from '../../../components/basic/PremText';
import PremButton from '../../../components/basic/PremButton';

import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { clearUser } from '../../../redux/reducers/authReducer';
import { removeTokenFromStorage } from '../../../utils/storage';

const Stats = () => {
  const authSlice = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  return (
    <View style={globalStyles.container}>
      <PremText order={2} centered>
        Some stats
      </PremText>
      <PremText>{`name: ${authSlice.user?.name}`}</PremText>
      {authSlice.user?.email && <PremText>{`email: ${authSlice.user?.email}`}</PremText>}
      <View style={globalStyles.centered}>
        <PremButton
          onPress={() => {
            removeTokenFromStorage();
            dispatch(clearUser());
          }}
        >
          Logout
        </PremButton>
      </View>
    </View>
  );
};

export default Stats;
