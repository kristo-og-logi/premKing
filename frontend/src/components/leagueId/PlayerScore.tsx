import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import PremText from '../basic/PremText';
import { colors } from '../../styles/styles';
import { ScoreboardPlayer } from '../../types/Player';

interface Props {
  player: ScoreboardPlayer;
  userId: string;
  position: number;
  gw: number;
  leagueSize: number;
}

const renderPointChange = (points: number, prevPoints: number) => {
  return <PremText order={4}>{points === prevPoints ? '' : `+${points - prevPoints}`}</PremText>;
};

const renderPositionChange = (posChange: number, gw: number) => {
  return (
    <View style={styles.positionChangeWrapper}>
      {gw === 1 || posChange === 0 ? (
        <></>
      ) : (
        <>
          {Math.abs(posChange) !== 1 && <PremText order={4}>{Math.abs(posChange)}</PremText>}
          {posChange > 0 ? (
            <FontAwesome name="circle" size={8} color={colors.green} />
          ) : (
            <FontAwesome name="circle" size={8} color={colors.red} />
          )}
        </>
      )}
    </View>
  );
};

const PlayerScore = ({ player, userId, position, gw, leagueSize }: Props) => {
  console.log(
    `player ${player.name}, position ${position}, posChange ${player.posChange}, prevPos: ${player.prevPosition}`
  );
  return (
    <View style={[styles.container, player.id === userId && styles.myScore]}>
      <View style={[styles.scoreWrapper, styles.leftSide]}>
        <View
          style={[
            styles.scoreWrapper,
            styles.positionWrapper,
            leagueSize >= 10 ? styles.between10and100WrapperWidth : styles.under10WrapperWidth,
          ]}
        >
          <View
            style={[
              styles.position,
              leagueSize >= 10 ? styles.between10and100Width : styles.under10Width,
            ]}
          >
            <PremText>{position}</PremText>
          </View>
          {renderPositionChange(player.posChange, gw)}
        </View>

        <PremText>{player.name}</PremText>
      </View>

      <View style={[styles.scoreWrapper, styles.rightSide]}>
        {renderPointChange(player.points, player.prevPoints)}
        <PremText>{player.points}</PremText>
      </View>
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
  positionChangeWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },

  position: {
    display: 'flex',
    alignItems: 'flex-end',
  },

  under10Width: {
    width: 10,
  },
  between10and100Width: {
    width: 25,
  },

  scoreWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },

  positionWrapper: {
    justifyContent: 'space-between',
  },

  under10WrapperWidth: {
    width: 40,
  },

  between10and100WrapperWidth: {
    width: 60,
  },

  leftSide: {
    width: 200,
    gap: 12,
  },

  rightSide: {
    width: 70,
    justifyContent: 'space-between',
  },
});

export default PlayerScore;
