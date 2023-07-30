import React from 'react';
import { Stack } from 'expo-router';

export default function StatsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerTitle: 'My stats' }} />
    </Stack>
  );
}
