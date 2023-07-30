import React from 'react';
import { Stack } from 'expo-router';
import { headerOptions } from '../../styles/styles';

export default function LeaguesLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerTitle: 'My Leagues', ...headerOptions }} />
      <Stack.Screen name="[leagueId]" options={{ headerTitle: '[League Id]', ...headerOptions }} />
    </Stack>
  );
}
