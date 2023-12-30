import React, { useState } from 'react';
import { Redirect } from 'expo-router';
import { useFonts } from 'expo-font';

export default function Page() {
  const [fontsLoaded] = useFonts({
    MusticaPro: require('../../assets/MusticaPro-SemiBold.otf'),
  });

  const [user, setUser] = useState<boolean>(false);

  // See https://docs.expo.dev/develop/user-interface/fonts/#use-a-custom-font if this stops working

  if (!fontsLoaded) return;
  return user ? <Redirect href="/main" /> : <Redirect href="/login" />;
}
