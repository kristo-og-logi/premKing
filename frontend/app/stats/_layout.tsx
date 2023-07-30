import React from 'react';
import { Stack } from 'expo-router';
import { headerOptions } from '../../styles/styles';

export default function StatsLayout() {
  return (
    <Stack screenOptions={{ ...headerOptions }}>
      <Stack.Screen name="index" options={{ headerTitle: 'My stats' }} />
    </Stack>
  );
}
