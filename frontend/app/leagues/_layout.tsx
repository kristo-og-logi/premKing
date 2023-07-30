import React from 'react';
import { Stack } from 'expo-router';

export default function LeaguesLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerTitle: 'My Leagues' }} />
    </Stack>
  );
}
