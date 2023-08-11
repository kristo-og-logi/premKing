import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { colors } from '../../styles/styles';

export const Gameweek = () => {
  return <Text style={styles.container}>Gameweek 2</Text>;
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    textAlign: 'center',
    fontFamily: 'MusticaPro',
    fontSize: 24,
    color: colors.gray[0],
  },
});
