import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../styles/styles';

export const Confirm = () => {
  return (
    <TouchableOpacity style={styles.container}>
      <Text style={styles.text}>Confirm</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 15,
    left: 40,
    right: 40,
    padding: 16,
    backgroundColor: colors.charcoal[2],
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 3,
    elevation: 5,
  },
  text: {
    textAlign: 'center',
    fontFamily: 'MusticaPro',
    fontSize: 24,
    color: colors.gray[0],
  },
});
