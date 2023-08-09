import { View, StyleSheet } from 'react-native';
import React from 'react';
import { colors } from '../../styles/styles';
import PremText from '../basic/PremText';

interface Props {
  league: { id: string; name: string; place: number; total: number };
}

const LeagueItem = ({ league }: Props) => {
  return (
    <View style={styles.item}>
      <PremText>{league.name}</PremText>
      <PremText>{league.place}</PremText>
      <PremText>{league.total}</PremText>
    </View>
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
