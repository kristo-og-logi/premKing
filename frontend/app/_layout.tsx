import React from 'react';
import { Tabs } from 'expo-router';

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0A475C',
          borderTopWidth: 0,
        },
        tabBarActiveTintColor: '#fff',
      }}
    >
      <Tabs.Screen name="leagues" />
      <Tabs.Screen name="bet" />
      <Tabs.Screen name="stats" />
      <Tabs.Screen name="index" options={{ href: null }} />
    </Tabs>
  );
}
