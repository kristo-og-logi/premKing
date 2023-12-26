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
        <Stack.Screen name="login" />
        <Stack.Screen name="main" />
      </Stack>
    </Provider>
  );
}

registerRootComponent(AppLayout);
