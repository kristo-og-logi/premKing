import React from 'react';
import { View, StyleSheet } from 'react-native';
import { calculateYourPlace } from '../../utils/leagueUtils';
import PremText from '../basic/PremText';
import User from '../../types/User';

interface Props {
  players: User[];
  myId?: string;
}

const ScoreboardFooter = ({ players, myId }: Props) => {
  return (
    <View style={styles.statsWrapper}>
      <PremText order={4}>{`your position: ${calculateYourPlace(players, myId)}`}</PremText>
      <PremText order={4}>{`total players: ${players.length}`}</PremText>
    </View>
  );
};

const styles = StyleSheet.create({
  statsWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 4,
  },
});

export default ScoreboardFooter;
