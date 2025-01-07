import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import PremButton from '../../../components/basic/PremButton';
import PremText from '../../../components/basic/PremText';
import PremModal from '../../../components/basic/PremModal';
import { colors, globalStyles } from '../../../styles/styles';

import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { clearUser } from '../../../redux/reducers/authReducer';
import { removeTokenFromStorage } from '../../../utils/storage';

import { BACKEND_URL, ENVIRONMENT } from '@env';

const Stats = () => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const authSlice = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  return (
    <View style={globalStyles.container}>
      <PremModal isActive={isActive} setIsActive={setIsActive}>
        <PremText order={3}>
          {
            'By pressing Delete, your account, its bets, scores & leagues will be removed forever.\n\nWhile you will be able to create a new account, your old information will be lost.'
          }
        </PremText>
        <View style={[styles.horizontal, { marginTop: 16 }]}>
          <PremButton
            onPress={() => {
              setIsActive(false);
            }}
            extraStyles={{ flex: 1, display: 'flex' }}
          >
            Cancel
          </PremButton>
          <PremButton
            onPress={() => {
              // TODO: send deleteAccount request
              setIsActive(false);
            }}
            extraStyles={{
              flex: 1,
              display: 'flex',
              backgroundColor: colors.red,
              opacity: 0.9,
            }}
          >
            Delete
          </PremButton>
        </View>
      </PremModal>
      <PremText order={2} centered>
        Some stats
      </PremText>
      <PremText>{`name: ${authSlice.user?.name}`}</PremText>
      {authSlice.user?.email && <PremText>{`email: ${authSlice.user?.email}`}</PremText>}
      <PremText>{`environment: ${ENVIRONMENT}`}</PremText>
      <PremText>{`backend url: ${BACKEND_URL}`}</PremText>
      <View style={[globalStyles.centered, styles.horizontal]}>
        <PremButton
          onPress={() => {
            removeTokenFromStorage();
            dispatch(clearUser());
          }}
          extraStyles={{ flex: 1, display: 'flex' }}
        >
          Logout
        </PremButton>
        <PremButton
          onPress={() => {
            setIsActive(true);
          }}
          extraStyles={{
            flex: 1,
            display: 'flex',
            backgroundColor: colors.red,
            opacity: 0.9,
          }}
        >
          Delete account
        </PremButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  horizontal: { flexDirection: 'row', gap: 24, marginHorizontal: 16 },
});

export default Stats;
