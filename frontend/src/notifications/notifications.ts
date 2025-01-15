import { Platform } from 'react-native';
import { BACKEND_URL } from '@env';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { useEffect, useRef, useState } from 'react';
import type { ExpoPushToken, Notification } from 'expo-notifications';
import {
  addNotificationResponseReceivedListener,
  removeNotificationSubscription,
  unregisterForNotificationsAsync,
} from 'expo-notifications';
import {
  addNotificationReceivedListener,
  getExpoPushTokenAsync,
  getPermissionsAsync,
  requestPermissionsAsync,
  setNotificationChannelAsync,
  setNotificationHandler,
  AndroidImportance,
} from 'expo-notifications';
import type { Subscription } from 'expo-notifications';
import { colors } from '../styles/styles';

export interface NotificationState {
  notification?: Notification;
  expoPushToken?: ExpoPushToken;
  isRegistered: boolean;
  setIsRegistered: (isRegistered: boolean) => void;
}

export const usePushNotification = (): NotificationState => {
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
      alert('You seem to have disabled notifications for this app. Please enable them in your device settings.');
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
    const token = await registerForPushNotificationAsync();
    setExpoPushToken(token);

    notificationListener.current = addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });

    responseListener.current = addNotificationResponseReceivedListener((response) => {
      console.log(`response: ${response}`);
    });
  };

  const unregister = async () => {
    await unregisterForNotificationsAsync();
    setExpoPushToken(undefined);
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
  const [isRegistered, setIsRegistered] = useState<boolean>(!!expoPushToken);

  useEffect(() => {
    if (isRegistered)
      register().catch(() => {
        // if we fail to register, we must unregister
        setIsRegistered(false);
      });
    else unregister();
  }, [isRegistered]);

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
    throw new Error(message.error);
  }

  const data = await response.json();
  return data === 'success';
};
