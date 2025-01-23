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
  expoPushToken?: string;
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

  const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
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

    let token: string;
    try {
      // TODO: handle throws here, most would be handled by just checking whether the user is online
      const tokenPromise = getExpoPushTokenAsync({ projectId: Constants.expoConfig?.extra?.eas?.projectId });

      // If we haven't gotten a push token after the timeout,
      // either we're offline (TODO), expo servers are down,
      // or we have just enabled notifications from the IOS settings
      // and haven't reloaded the app since.
      const expoToken = await Promise.race<ExpoPushToken>([
        tokenPromise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000)),
      ]);

      token = expoToken.data;
    } catch (err) {
      // There are a couple of steps we can take to recover,
      // 1. expo servers are down OR we've just enabled notifications (IOS)
      // == check if we have stored the token and use that one

      const storedToken = await getExpoPushTokenFromStorage();
      if (storedToken.expoPushToken) {
        token = storedToken.expoPushToken;
      } else {
        alert('Failed to setup notifications :(\nRefresh and try again!');
        throw new Error('failed to get Expo Token');
      }
    }

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
    const token = await registerForPushNotificationAsync();
    setExpoPushToken(token);

    const success = await addPush(jwtToken, token);
    // caller catches error
    if (!success) throw new Error('failed to add push token to backend');

    await saveExpoPushTokenFromStorage({ hasAsked: true, isRegistered: true, expoPushToken: token });

    notificationListener.current = addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });

    responseListener.current = addNotificationResponseReceivedListener((response) => {
      console.log(`response: ${response}`);
    });
  };

  const unregister = async () => {
    await unregisterForNotificationsAsync();
    // this must be run before the expoPushToken is set to undefined
    await saveExpoPushTokenFromStorage({ hasAsked: true, isRegistered: false, expoPushToken: expoPushToken ?? '' });

    setExpoPushToken(undefined);

    const success = await removePush(jwtToken);
    if (!success) {
      console.error('failed to remove push token in backend');
    }

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
      if (ept.hasAsked) {
        // we've already asked -- user won't be prompted
        // let's double check that the user hasn't disabled notifications from settings
        getPermissionsAsync().then((status) => {
          if ((status.status === 'granted') != ept.isRegistered) {
            // user has changed their notification preferences
            // lets update our app's state to reflect that change
            setIsRegistered(status.status === 'granted');
          } else {
            _setIsRegistered(ept.isRegistered);
          }
        });
      }
    });
  }, []);

  const setIsRegistered = (_isRegistered: boolean) => {
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
