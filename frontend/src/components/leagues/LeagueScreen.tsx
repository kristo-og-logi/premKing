import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { LeagueStackParamList } from '../../routes/LeagueMenu';

type LeagueScreenProps = NativeStackScreenProps<LeagueStackParamList, 'LeagueScreen'>;

const loadLeagues = (leagues: string[], navigation) => {
  return leagues.map((league) => (
    <View style={styles.button} key={league}>
      <Button
        color={'white'}
        title={league}
        onPress={() => navigation.navigate('SelectedLeague', { name: league })}
      ></Button>
    </View>
  ));
};

const LeagueScreen = ({ navigation }: LeagueScreenProps) => {
  const [leagues, setLeagues] = useState(['the saudi takeover', 'the best league']);

  return (
    <View style={styles.container}>
      <View style={styles.buttonWrapper}>
        {loadLeagues(leagues, navigation)}
        <View style={styles.actionWrapper}>
          <View style={styles.button}>
            <Button
              color={'white'}
              title="Join League"
              onPress={() =>
                navigation.navigate('JoinLeague', {
                  leagues: leagues,
                  setLeagues: setLeagues,
                })
              }
            />
          </View>
          <View style={styles.button}>
            <Button
              color={'white'}
              title="Create League"
              onPress={() =>
                navigation.navigate('CreateLeague', {
                  leagues: leagues,
                  setLeagues: setLeagues,
                })
              }
            />
          </View>
        </View>
      </View>
    </View>
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

export default LeagueScreen;
