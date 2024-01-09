import React from 'react';
import { Redirect, Tabs } from 'expo-router';
import { Entypo, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppSelector } from '../../redux/hooks';
import { colors } from '../../styles/styles';

export default function MainLayout() {
  const authSlice = useAppSelector((state) => state.auth);

  if (!authSlice.user) return <Redirect href="/login" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.charcoal[3],
          borderTopWidth: 0,
        },
        tabBarActiveTintColor: colors.charcoal[12],
        tabBarInactiveTintColor: colors.charcoal[10],
      }}
    >
      <Tabs.Screen
        name="leagues"
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="trophy" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="bet"
        options={{ tabBarIcon: ({ color }) => <Entypo name="ticket" size={24} color={color} /> }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="stats-chart" size={24} color={color} />,
        }}
      />
      <Tabs.Screen name="index" options={{ href: null }} />
    </Tabs>
  );
}
