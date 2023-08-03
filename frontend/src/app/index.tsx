import React from 'react';
import { Redirect } from 'expo-router';
import { useFonts } from 'expo-font';

export default function Page() {
  const [fontsLoaded] = useFonts({
    MusticaPro: require('../../assets/MusticaPro-SemiBold.otf'),
  });

  // See https://docs.expo.dev/develop/user-interface/fonts/#use-a-custom-font if this stops working

  if (!fontsLoaded) return;
  return <Redirect href="/leagues" />;
}
