import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

const LeagueMenu = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.whiteText}>My leagues</Text>
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 4,
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
});

export default LeagueMenu;
