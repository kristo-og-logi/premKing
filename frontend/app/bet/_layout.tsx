import React from 'react';
import { Stack } from 'expo-router';
import { headerOptions } from '../../styles/styles';

export default function BetLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerTitle: 'my bet', ...headerOptions }} />
    </Stack>
  );
}
