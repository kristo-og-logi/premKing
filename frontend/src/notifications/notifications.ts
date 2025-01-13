import { Platform } from 'react-native';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { useEffect, useRef, useState } from 'react';
import type { ExpoPushToken, Notification } from 'expo-notifications';
import { addNotificationResponseReceivedListener, removeNotificationSubscription } from 'expo-notifications';
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
        let token: ExpoPushToken;

        if (Device.isDevice) {
            const { status: existingStatus } = await getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus != 'granted') {
                const { status } = await requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                alert('failed to get push token');
            }

            token = await getExpoPushTokenAsync({ projectId: Constants.expoConfig?.extra?.eas?.projectId });

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
        throw new Error('running on simulator, no notification available');
    }

    useEffect(() => {
        registerForPushNotificationAsync().then((token) => {
            setExpoPushToken(token);
        });
        notificationListener.current = addNotificationReceivedListener((notification) => {
            setNotification(notification);
        });

        responseListener.current = addNotificationResponseReceivedListener((response) => {
            console.log(`response: ${response}`);
        });

        return () => {
            if (notificationListener.current) removeNotificationSubscription(notificationListener.current);
            if (responseListener.current) removeNotificationSubscription(responseListener.current);
        };
    }, []);

    return { expoPushToken, notification };
};
