import React from 'react';
import { Tabs } from 'expo-router';

export default function AppLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="leagues" options={{ headerShown: false }} />
      <Tabs.Screen name="bet" options={{ headerShown: false }} />
      <Tabs.Screen name="stats" options={{ headerShown: false }} />
      <Tabs.Screen name="index" options={{ href: null }} />
      {/* <Tabs.Screen name="[id]" options={{ href: null }} /> */}
    </Tabs>
  );
}
