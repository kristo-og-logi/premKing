import React from 'react';
import { Redirect, Tabs } from 'expo-router';
import { Entypo, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppSelector } from '../../redux/hooks';

export default function MainLayout() {
  const userSlice = useAppSelector((state) => state.user);

  if (!userSlice.user) return <Redirect href="/login" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0A475C',
          borderTopWidth: 0,
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#aaa',
      }}
    >
      <Tabs.Screen
        name="leagues"
        options={{
          tabBarIcon: () => <MaterialCommunityIcons name="trophy" size={24} color={'#fff'} />,
        }}
      />
      <Tabs.Screen
        name="bet"
        options={{ tabBarIcon: () => <Entypo name="ticket" size={24} color={'#fff'} /> }}
      />
      <Tabs.Screen
        name="stats"
        options={{ tabBarIcon: () => <Ionicons name="stats-chart" size={24} color={'#fff'} /> }}
      />
      <Tabs.Screen name="index" options={{ href: null }} />
    </Tabs>
  );
}
