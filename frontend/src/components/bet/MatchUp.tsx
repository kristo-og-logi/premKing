import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors } from '../../styles/styles';
import liverpoolImg from '../../../assets/team-logos/liverpool.png';
import chelseaImg from '../../../assets/team-logos/chelsea.png';

const TeamLeft = () => {
  return (
    <View style={styles.header}>
      <Text style={[styles.text, styles.headerText]}>Liverpool</Text>
      <TouchableOpacity style={styles.team}>
        <Text style={styles.text}>1.49</Text>
        <Image source={liverpoolImg} style={styles.image} />
      </TouchableOpacity>
    </View>
  );
};

const TeamRight = () => {
  return (
    <View style={styles.header}>
      <Text style={[styles.text, styles.headerText]}>Chelsea</Text>
      <TouchableOpacity style={styles.team}>
        <Image source={chelseaImg} style={styles.image} />
        <Text style={styles.text}>2.49</Text>
      </TouchableOpacity>
    </View>
  );
};

const DrawMiddle = () => {
  return (
    <View style={styles.header}>
      <Text style={[styles.text, styles.matchText]}>12. August 13:00</Text>
      <TouchableOpacity style={styles.draw}>
        <Text style={styles.text}>Draw</Text>
        <Text style={styles.text}>1.03</Text>
      </TouchableOpacity>
    </View>
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
    padding: 10,
  },
  draw: {
    flex: 1,
    alignSelf: 'center',
    padding: 5,
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
  },
  image: {
    height: 50,
    width: 50,
  },
  text: {
    alignSelf: 'center',
    textAlign: 'center',
    fontFamily: 'MusticaPro',
    fontSize: 24,
    color: colors.gray[0],
  },
  matchText: {
    fontSize: 12,
    padding: 12,
  },
  headerText: {
    padding: 4,
  },
});
