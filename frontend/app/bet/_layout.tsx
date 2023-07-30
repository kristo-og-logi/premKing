import React from 'react';
import { Stack } from 'expo-router';

export default function BetLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerTitle: 'my bet' }} />
    </Stack>
  );
}
