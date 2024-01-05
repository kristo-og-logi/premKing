import React from 'react';
import { Slot } from 'expo-router';
import { registerRootComponent } from 'expo';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { useFonts } from 'expo-font';

export default function AppLayout() {
  const [fontsLoaded] = useFonts({
    MusticaPro: require('../../assets/MusticaPro-SemiBold.otf'),
  });
  // See https://docs.expo.dev/develop/user-interface/fonts/#use-a-custom-font if this stops working

  if (!fontsLoaded) return;

  return (
    <Provider store={store}>
      <Slot />
    </Provider>
  );
}

registerRootComponent(AppLayout);
