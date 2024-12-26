import { Stack } from 'expo-router';
import React from 'react';
import { headerOptions } from '../../../styles/styles';

export default function BetLayout() {
  return (
    <Stack screenOptions={{ ...headerOptions }}>
      <Stack.Screen name="index" options={{ headerTitle: 'My Bet' }} />
    </Stack>
  );
}
