import React from 'react';
import { StyleSheet, View } from 'react-native';
import PremText from '../basic/PremText';
import { colors } from '../../styles/styles';
import { ScoreboardPlayer } from '../../types/Player';

interface Props {
  player: ScoreboardPlayer;
  userId: string;
  position: number;
}

const printPointChange = (points: number, prevPoints: number) => {
  return <PremText>{points === prevPoints ? '' : `+${points - prevPoints}`}</PremText>;
};

const PlayerScore = ({ player, userId, position }: Props) => {
  return (
    <View style={[styles.container, player.id === userId && styles.myScore]}>
      <PremText>{position}</PremText>
      <PremText>{player.name}</PremText>
      {printPointChange(player.points, player.prevPoints)}
      <PremText>{player.points}</PremText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: 'auto',
    justifyContent: 'space-between',
    padding: 8,
    backgroundColor: colors.charcoal[3],
  },
  myScore: {
    backgroundColor: colors.charcoal[4],
    borderWidth: 1,
    borderColor: colors.charcoal[5],
  },
});

export default PlayerScore;
