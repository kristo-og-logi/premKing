import React from 'react';
import { Text, StyleSheet, Button, View, TouchableOpacity } from 'react-native';
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
    position: 'absolute', // Position the button absolutely
    bottom: 15, // Stick it to the bottom
    left: 40, // Align it to the left (you can adjust this if needed)
    right: 40, // Align it to the right (you can adjust this if needed)
    padding: 16, // Add padding if needed
    backgroundColor: colors.charcoal[2],
    shadowColor: 'black', // Shadow color
    shadowOpacity: 0.3, // Shadow opacity (0 to 1)
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 3, // Shadow radius
    elevation: 5,
  },
  text: {
    textAlign: 'center',
    fontFamily: 'MusticaPro',
    fontSize: 24,
    color: colors.gray[0],
  },
});
