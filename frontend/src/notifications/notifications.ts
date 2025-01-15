import { Platform } from 'react-native';
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
      alert('You seem to have disabled notifications for this app. Please enable them in your device settings.');
    }

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
