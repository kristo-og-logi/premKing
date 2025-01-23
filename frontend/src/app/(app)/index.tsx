import { Redirect } from 'expo-router';
import React, { useEffect } from 'react';
import { useAppSelector } from '../../redux/hooks';
import { usePushNotification } from '../../notifications/notifications';
import { getExpoPushTokenFromStorage } from '../../utils/storage';

export default function Page() {
  const authSlice = useAppSelector((state) => state.auth);
  const { setIsRegistered } = usePushNotification(authSlice.token);

  // this screen is only rendered for logged in users
  useEffect(() => {
    // on first load, check whether user has been asked before
    // whether they'd like notifications
    getExpoPushTokenFromStorage().then((ept) => {
      if (!ept.hasAsked) {
        // attempt to register
        setIsRegistered(true);
      }
    });
  }, []);

  return <Redirect href="/leagues" />;
}
