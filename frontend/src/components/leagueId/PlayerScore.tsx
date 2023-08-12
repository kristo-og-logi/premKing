import React from 'react';
import { StyleSheet, View } from 'react-native';
import PremText from '../basic/PremText';
import { colors } from '../../styles/styles';
import { Player } from '../../types/Player';

interface Props {
  player: Player;
  position: number;
}

const PlayerScore = ({ player, position }: Props) => {
  console.log('playerScore for: ', player.name);
  return (
    <View style={styles.container}>
      <PremText>{position}</PremText>
      <PremText>{player.name}</PremText>
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
});

export default PlayerScore;
