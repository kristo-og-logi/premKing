import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../styles/styles';
import PremText from '../basic/PremText';

export const Confirm = () => {
  return (
    <TouchableOpacity style={styles.container}>
      <PremText order={2} centered={true}>
        Confirm
      </PremText>
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
});
