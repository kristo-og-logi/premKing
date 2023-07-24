import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

const LeagueMenu = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.whiteText}>Open up App.tsx to start working on your app!</Text>
      <View style={{ height: 100, width: 100, backgroundColor: 'orange' }}></View>
      <View style={styles.button}>
        <Button
          color={'white'}
          title="goto selected league"
          onPress={() => navigation.navigate('SelectedLeague')}
        ></Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#072936',
    alignItems: 'center',
  },
  whiteText: {
    color: 'white',
  },
  buttonBackground: {
    backgroundColor: '#0A475C',
  },
  button: {
    backgroundColor: '#0A475C',
    color: 'white',
  },
});

export default LeagueMenu;
