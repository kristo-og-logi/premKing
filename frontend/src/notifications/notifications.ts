import { BACKEND_URL } from '@env';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import type { ExpoPushToken, Notification } from 'expo-notifications';
import {
  addNotificationResponseReceivedListener,
  removeNotificationSubscription,
  unregisterForNotificationsAsync,
} from 'expo-notifications';
import {
  AndroidImportance,
  addNotificationReceivedListener,
  getExpoPushTokenAsync,
  getPermissionsAsync,
  requestPermissionsAsync,
  setNotificationChannelAsync,
  setNotificationHandler,
} from 'expo-notifications';
import type { Subscription } from 'expo-notifications';
import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { colors } from '../styles/styles';
import { getExpoPushTokenFromStorage, saveExpoPushTokenFromStorage } from '../utils/storage';

export interface NotificationState {
  notification?: Notification;
  expoPushToken?: ExpoPushToken;
  isRegistered: boolean;
  setIsRegistered: (isRegistered: boolean) => void;
}

export const usePushNotification = (jwtToken: string): NotificationState => {
  setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: false,
      shouldShowAlert: true,
      shouldSetBadge: false,
    }),
  });

  const [expoPushToken, setExpoPushToken] = useState<ExpoPushToken | undefined>();
  const [notification, setNotification] = useState<Notification | undefined>();

  const notificationListener = useRef<Subscription>();
  const responseListener = useRef<Subscription>();

  async function registerForPushNotificationAsync() {
    if (!Device.isDevice) throw new Error('running on simulator, notifications unavailable');

    const { status: existingStatus } = await getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus != 'granted') {
      const { status } = await requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      // TODO: do not throw this alert when the user denies notifications the first time around
      // only when wanting to enable them when he has previously disabled them.
      alert('Notifications are disabled for this app. To enable them,  go to \nSettings -> Apps -> PremKing');
      throw Error();
    }

    // TODO: handle throws here, most would be handled by just checking whether the user is online
    const token = await getExpoPushTokenAsync({ projectId: Constants.expoConfig?.extra?.eas?.projectId });

    // some extra android stuff
    if (Platform.OS === 'android') {
      setNotificationChannelAsync('default', {
        name: 'default',
        importance: AndroidImportance.DEFAULT,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: colors.charcoal[3],
      });
    }

    return token;
  }

  const register = async () => {
    console.log('register()');
    const token = await registerForPushNotificationAsync();
    setExpoPushToken(token);

    const success = await addPush(jwtToken, token.data);
    // caller catches error
    if (!success) throw new Error('failed to add push token to backend');

    saveExpoPushTokenFromStorage({ hasAsked: true, isRegistered: true, expoPushToken: token.data });

    notificationListener.current = addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });

    responseListener.current = addNotificationResponseReceivedListener((response) => {
      console.log(`response: ${response}`);
    });
  };

  const unregister = async () => {
    console.log('unregister()');
    await unregisterForNotificationsAsync();
    setExpoPushToken(undefined);

    const success = await removePush(jwtToken);
    if (!success) {
      console.error('failed to remove push token in backend');
    }

    saveExpoPushTokenFromStorage({ hasAsked: true, isRegistered: false, expoPushToken: '' });

    if (notificationListener.current) {
      removeNotificationSubscription(notificationListener.current);
      notificationListener.current = undefined;
    }
    if (responseListener.current) {
      removeNotificationSubscription(responseListener.current);
      responseListener.current = undefined;
    }
  };

  // for the user to check whether they are currently registered or not
  const [isRegistered, _setIsRegistered] = useState<boolean>(!!expoPushToken);

  // set initial value on load
  useEffect(() => {
    getExpoPushTokenFromStorage().then((ept) => {
      console.log('got push token from storage', JSON.stringify(ept));
      _setIsRegistered(ept.isRegistered);
    });
  }, []);

  const setIsRegistered = (_isRegistered: boolean) => {
    console.log(`setting isRegistered(${_isRegistered})`);
    _setIsRegistered(_isRegistered);

    if (_isRegistered) {
      register().catch(() => {
        console.error('failed to register for notifications');

        // call function again, setting registered to false
        setIsRegistered(false);
      });
    } else {
      unregister();
    }
  };

  return { expoPushToken, notification, isRegistered, setIsRegistered };
};

// POST request to backend to save the user's push token
export const addPush = async (authToken: string, pushToken: string): Promise<boolean> => {
  console.log('adding push token');
  const url = `${BACKEND_URL}/api/v1/users/me/push`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${authToken}` },
    body: JSON.stringify({
      pushToken: pushToken,
    }),
  });

  if (!response.ok) {
    const message: { error: string } = await response.json();
    console.error(`failed to add push token: ${message.error}`);
    return false;
  }

  const data = await response.json();
  return data === 'success';
};

// DELETE request to backend to delete the user's push token
export const removePush = async (authToken: string): Promise<boolean> => {
  console.log('removing push token');
  try {
    const url = `${BACKEND_URL}/api/v1/users/me/push`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authToken}` },
    });

    if (!response.ok) {
      const message: { error: string } = await response.json();
      console.error(`failed to remove push token: ${message.error}`);
      return false;
    }

    const data = await response.json();
    return data === 'success';
  } catch (err) {
    console.error('unknown error', err);
    return false;
  }
};
