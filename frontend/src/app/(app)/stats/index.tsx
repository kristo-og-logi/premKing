import React from 'react';
import { View } from 'react-native';
import PremButton from '../../../components/basic/PremButton';
import PremText from '../../../components/basic/PremText';
import { globalStyles } from '../../../styles/styles';

import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { clearUser } from '../../../redux/reducers/authReducer';
import { removeTokenFromStorage } from '../../../utils/storage';

import { BACKEND_URL, ENVIRONMENT } from '@env';

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
      <PremText>{`environment: ${ENVIRONMENT}`}</PremText>
      <PremText>{`backend url: ${BACKEND_URL}`}</PremText>
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
