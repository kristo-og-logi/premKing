import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import FooterTabs from './src/components/global/FooterTabs';

import SelectedLeague from './src/routes/SelectedLeague';
import LeagueMenu from './src/routes/LeagueMenu';

export type StackParamList = {
  LeagueMenu: undefined;
  SelectedLeague: { name: string };
};

const Stack = createNativeStackNavigator<StackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="LeagueMenu"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0A475C',
          },
          headerTintColor: '#fff',
          headerBackTitle: '',
        }}
      >
        <Stack.Screen
          name="LeagueMenu"
          component={LeagueMenu}
          options={{
            title: 'My Leagues',
          }}
        />
        <Stack.Screen
          name="SelectedLeague"
          component={SelectedLeague}
          options={({ route }) => ({
            title: route.params.name,
          })}
        />
      </Stack.Navigator>
      {/* <FooterTabs /> */}
    </NavigationContainer>
  );
};

export default App;