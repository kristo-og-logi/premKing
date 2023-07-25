import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import JoinLeague from '../components/JoinLeague';
import CreateLeague from '../components/CreateLeague';

const LeagueStack = createNativeStackNavigator();

const LeagueScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.buttonWrapper}>
        <View style={styles.button}>
          <Button
            color={'white'}
            title="the best league"
            onPress={() => navigation.navigate('SelectedLeague', { name: 'the best league' })}
          ></Button>
        </View>
        <View style={styles.button}>
          <Button
            color={'white'}
            title="the saudi takeover"
            onPress={() => navigation.navigate('SelectedLeague', { name: 'The Saudi Takeover' })}
          ></Button>
        </View>
        <View style={styles.actionWrapper}>
          <View style={styles.button}>
            <Button
              color={'white'}
              title="Join League"
              onPress={() => navigation.navigate('JoinLeague')}
            />
          </View>
          <View style={styles.button}>
            <Button
              color={'white'}
              title="Create League"
              onPress={() => navigation.navigate('CreateLeague')}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const LeagueMenu = ({ navigation }) => {
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    backgroundColor: '#072936',
    alignItems: 'center',
  },
  whiteText: {
    color: 'white',
  },
  buttonBackground: {
    backgroundColor: '#0A475C',
  },
  buttonWrapper: {
    flex: 0,
    gap: 20,
  },
  button: {
    backgroundColor: '#0A475C',
    color: 'white',
  },
  actionWrapper: {
    flex: 0,
    gap: 8,
    flexDirection: 'row',
  },
});

export default LeagueMenu;
