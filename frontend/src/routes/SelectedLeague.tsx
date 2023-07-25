import React from 'react';
import { Button, StyleSheet, View } from 'react-native';

const SelectedLeague = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={{ height: 100, width: 100, backgroundColor: 'red' }}></View>
      <View style={styles.button}>
        <Button
          color={'white'}
          title="goto League Menu"
          onPress={() => navigation.navigate('LeagueMenu')}
        ></Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
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

export default SelectedLeague;
