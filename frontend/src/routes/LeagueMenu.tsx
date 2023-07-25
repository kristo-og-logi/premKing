import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import JoinLeague from '../components/leagues/JoinLeague';
import CreateLeague from '../components/leagues/CreateLeague';
import { StackParamList } from '../../App';
import LeagueScreen from '../components/leagues/LeagueScreen';

export type LeagueStackParamList = {
  LeagueScreen: undefined;
  CreateLeague: { leagues: string[]; setLeagues: (leagues: string[]) => void };
  JoinLeague: { leagues: string[]; setLeagues: (leagues: string[]) => void };
};

const LeagueStack = createNativeStackNavigator<LeagueStackParamList>();

type Props = NativeStackScreenProps<StackParamList, 'LeagueMenu'>;

const LeagueMenu = ({ navigation }: Props) => {
  return (
    <LeagueStack.Navigator
      initialRouteName="LeagueScreen"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#0A475C',
        },
        headerTintColor: '#fff',
        headerBackTitle: '',
      }}
    >
      <LeagueStack.Screen
        options={{ headerShown: false }}
        name="LeagueScreen"
        component={LeagueScreen}
      />
      <LeagueStack.Group screenOptions={{ presentation: 'modal' }}>
        <LeagueStack.Screen name="CreateLeague" component={CreateLeague} />
        <LeagueStack.Screen name="JoinLeague" component={JoinLeague} />
      </LeagueStack.Group>
    </LeagueStack.Navigator>
  );
};

export default LeagueMenu;
