import React from 'react';
import { Tabs } from 'expo-router';
import { Entypo, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { registerRootComponent } from 'expo';
import { Provider } from 'react-redux';
import { store } from '../store';

export default function AppLayout() {
  return (
    <Provider store={store}>
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
    </Provider>
  );
}

registerRootComponent(AppLayout);
