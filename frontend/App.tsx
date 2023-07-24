import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import FooterTabs from './src/components/global/FooterTabs';

import SelectedLeague from './src/routes/SelectedLeague';
import LeagueMenu from './src/routes/LeagueMenu';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="LeagueMenu"
          component={LeagueMenu}
          options={{
            title: 'My Leagues',
            headerStyle: {
              backgroundColor: '#0A475C',
            },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen
          name="SelectedLeague"
          component={SelectedLeague}
          options={({ route }) => ({
            title: route.params.name,
            headerStyle: {
              backgroundColor: '#0A475C',
            },
            headerTintColor: '#fff',
          })}
        />
      </Stack.Navigator>
      {/* <FooterTabs /> */}
    </NavigationContainer>
  );
};

export default App;
