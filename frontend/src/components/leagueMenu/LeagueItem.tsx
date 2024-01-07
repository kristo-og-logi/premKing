import { View, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { colors } from '../../styles/styles';
import PremText from '../basic/PremText';
import { League } from '../../types/League';

interface Props {
  league: League;
  onPress: () => void;
}

const LeagueItem = ({ league, onPress }: Props) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.item}>
        <View style={styles.leftSide}>
          <PremText>{league.name || 'unnamed league'}</PremText>
          <PremText order={4}>{league.id}</PremText>
        </View>
        <View style={[styles.rightSide]}>
          <View style={styles.horizontalWrapper}>
            <PremText order={4}>members</PremText>
            <PremText>{league.total || '?'}</PremText>
          </View>

          <View style={styles.horizontalWrapper}>
            <PremText order={4}>position</PremText>
            <PremText>{league.place || '?'}</PremText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: colors.charcoal[2],
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 2,
    paddingHorizontal: 12,
    padding: 8,
  },
  horizontalWrapper: {
    width: 80,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  leftSide: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },

  rightSide: {
    display: 'flex',
    gap: 8,
  },
});

export default LeagueItem;
