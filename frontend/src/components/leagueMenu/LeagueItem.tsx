import { View, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { colors } from '../../styles/styles';
import PremText from '../basic/PremText';
import { League } from '../../types/League';
import { useAppSelector } from '../../redux/hooks';
import { Redirect } from 'expo-router';
import { renderChange } from '../leagueId/PlayerScore';

interface Props {
  league: League;
  gw: number;
  onPress: () => void;
}

const LeagueItem = ({ league, gw, onPress }: Props) => {
  const me = useAppSelector((state) => state.auth.user);
  const leagueSlice = useAppSelector((state) => state.leagues);
  if (!me) return <Redirect href="/" />;

  const posChange = (l: League): number => {
    if (gw == 1) {
      return 0;
    }
    return l.position[gw - 2].position - l.position[gw - 1].position;
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.item}>
        <View style={styles.leftSide}>
          <PremText>{league.name || 'unnamed league'}</PremText>
          <PremText order={4}>{league.id}</PremText>
        </View>
        <View style={[styles.rightSide]}>
          <View style={styles.horizontalWrapper}>
            <View style={styles.memberPosition}>
              <PremText order={4}>members</PremText>
              <PremText>{league.members}</PremText>
            </View>
          </View>

          <View style={styles.horizontalWrapper}>
            <View>
              <View style={styles.memberPosition}>
                <PremText order={4}>position</PremText>
                <PremText>{leagueSlice.isLoading ? '...' : league.position[gw - 1]?.position || 'x'}</PremText>
              </View>
            </View>
            {renderChange(posChange(league), gw, true)}
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
    width: 105,
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
  memberPosition: {
    width: 80,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default LeagueItem;
