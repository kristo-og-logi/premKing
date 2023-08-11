import { View, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { colors } from '../../styles/styles';
import PremText from '../basic/PremText';

interface Props {
  league: { id: string; name: string; place: number; total: number };
  onPress: () => void;
}

const LeagueItem = ({ league, onPress }: Props) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.item}>
        <PremText>{league.name}</PremText>
        <PremText>{league.place}</PremText>
        <PremText>{league.total}</PremText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: colors.charcoal[2],
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 8,
  },
});

export default LeagueItem;
