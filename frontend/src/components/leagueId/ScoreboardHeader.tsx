import React from 'react';
import { StyleSheet, View } from 'react-native';
import { scoreboardWidths } from '../../styles/styles';
import PremText from '../basic/PremText';
import type { Player } from '../../types/Player';

interface Props {
  gw: number;
  players: Player[];
}

const ScoreboardHeader = ({ gw, players }: Props) => {
  return (
    <>
      <View style={styles.scoreboardHeader}>
        <PremText centered>Scoreboard</PremText>
      </View>
      <View style={styles.header}>
        <View style={[styles.textWrapper]}>
          <View
            style={[
              styles.textWrapper,
              players.length >= 10
                ? scoreboardWidths.between10and100WrapperWidth
                : scoreboardWidths.under10WrapperWidth,
            ]}
          >
            <PremText order={4}>pos</PremText>
            <PremText order={4}>+/-</PremText>
          </View>
          <PremText order={4}>name</PremText>
        </View>
        <View style={[styles.textWrapper, scoreboardWidths.pointsWidth]}>
          <PremText order={4}>{`gw${gw}`}</PremText>
          <PremText order={4}>points</PremText>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  scoreboardHeader: {
    padding: 4,
  },
  textWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
  },
});

export default ScoreboardHeader;
