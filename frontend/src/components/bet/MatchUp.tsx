import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors } from '../../styles/styles';
import liverpoolImg from '../../../assets/team-logos/liverpool.png';
import chelseaImg from '../../../assets/team-logos/chelsea.png';

const TeamLeft = () => {
  return (
    <TouchableOpacity style={styles.team}>
      <Text style={styles.text}>1.49</Text>
      <Image source={liverpoolImg} style={styles.image} />
    </TouchableOpacity>
  );
};

const TeamRight = () => {
  return (
    <TouchableOpacity style={styles.team}>
      <Image source={chelseaImg} style={styles.image} />
      <Text style={styles.text}>2.49</Text>
    </TouchableOpacity>
  );
};

const DrawMiddle = () => {
  return (
    <TouchableOpacity style={styles.draw}>
      <Text style={styles.text}>Draw</Text>
      <Text style={styles.text}>1.03</Text>
    </TouchableOpacity>
  );
};

export const MatchUp = () => {
  return (
    <View style={styles.container}>
      <TeamLeft />
      <DrawMiddle />
      <TeamRight />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  team: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: colors.charcoal[2],
    gap: 20,
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  draw: {
    display: 'flex',
    alignSelf: 'center',
    padding: 15,
  },
  image: {
    height: 60,
    width: 60,
  },
  text: {
    alignSelf: 'center',
    textAlign: 'center',
    fontFamily: 'MusticaPro',
    fontSize: 24,
    color: colors.gray[0],
  },
});
