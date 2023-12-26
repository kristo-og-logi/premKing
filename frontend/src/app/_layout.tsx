import React from 'react';
import { Stack } from 'expo-router';
import { registerRootComponent } from 'expo';
import { Provider } from 'react-redux';
import { store } from '../store';

export default function AppLayout() {
  return (
    <Provider store={store}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="login" options={{ animation: 'none' }} />
        <Stack.Screen name="main" options={{ animation: 'fade' }} />
      </Stack>
    </Provider>
  );
}

registerRootComponent(AppLayout);
