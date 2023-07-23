import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.whiteText}>Login Screen</Text>
      <View style={{ height: 100, width: 100, backgroundColor: 'red' }}></View>
      <View style={styles.button}>
        <Button color={'white'} title="this is a button"></Button>
      </View>
    </View>
  );
}

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
