import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Switch } from 'react-native';
import PremButton from '../../../components/basic/PremButton';
import PremModal from '../../../components/basic/PremModal';
import PremText from '../../../components/basic/PremText';
import { colors, globalStyles } from '../../../styles/styles';

import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { clearUser, deleteAccount } from '../../../redux/reducers/authReducer';
import { removeTokenFromStorage } from '../../../utils/storage';

import { BACKEND_URL, ENVIRONMENT } from '@env';
import { addPush, usePushNotification } from '../../../notifications/notifications';

const Stats = () => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const authSlice = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const { expoPushToken, notification, isRegistered, setIsRegistered } = usePushNotification();

  useEffect(() => {
    console.log(
      'received notification at',
      new Date((notification?.date ?? 0) * 1000),
      `${notification?.request.content.title}: ${notification?.request.content.body}`,
    );
  }, [notification]);

  useEffect(() => {
    if (!expoPushToken) return;

    addPush(authSlice.token, expoPushToken.data)
      .then((success) => {
        if (!success) {
          console.error("failed to save user's push token");
          setIsRegistered(false); // we failed, so we're not yet registered
        } else {
          console.log('successfully stored push token');
        }
      })
      .catch((err) => {
        console.error('failed to add push token', err);
      });
    console.log(`expoPushToken: ${expoPushToken.data}`);

    // Send expoPushToken to backend
  }, [expoPushToken]);

  const deleteAcc = async () => {
    dispatch(deleteAccount({ token: authSlice.token }));
  };

  return (
    <View style={globalStyles.container}>
      <PremModal isActive={isActive} setIsActive={setIsActive}>
        <PremText order={3}>
          {
            "By pressing Delete, your account, its bets & scores, along with your spot in other leagues as well as the leagues you've created will be removed forever.\n\nWhile you will be able to create a new account, your old information will be lost."
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
            onPress={async () => {
              await deleteAcc();
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

      <View>
        <View style={[styles.bar]}>
          <PremText>Notifications</PremText>
          <Switch
            value={isRegistered}
            onValueChange={async () => {
              setIsRegistered(!isRegistered);
            }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  horizontal: { flexDirection: 'row', gap: 24, marginHorizontal: 16 },
  bar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', margin: 16 },
});

export default Stats;
