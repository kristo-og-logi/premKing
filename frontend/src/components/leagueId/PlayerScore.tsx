import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import PremText from '../basic/PremText';
import { colors, scoreboardWidths } from '../../styles/styles';
import type { Player } from '../../types/Player';

interface Props {
  player: Player;
  userId?: string;
  position: number;
  gw: number;
  leagueSize: number;
}

const renderPointChange = (gw: number, player: Player) => {
  const increase = player.scores[gw - 1].score;

  return <PremText order={4}>{increase === 0 ? '' : `+ x${increase.toFixed(2)}`}</PremText>;
};

const renderPositionChange = (player: Player, gw: number) => {
  const posChange = (player: Player, gw: number) => {
    if (gw === 1) return 0;
    return player.scores[gw - 2].place - player.scores[gw - 1].place;
  };
  return renderChange(posChange(player, gw), gw);
};

export const renderChange = (posChange: number, gw: number, opposite = false) => {
  return (
    <View style={styles.positionChangeWrapper}>
      {gw === 1 || posChange === 0 ? (
        <></>
      ) : (
        <>
          {Math.abs(posChange) !== 1 && !opposite && <PremText order={4}>{Math.abs(posChange)}</PremText>}
          {posChange > 0 ? (
            <FontAwesome name="circle" size={8} color={colors.green} />
          ) : (
            <FontAwesome name="circle" size={8} color={colors.red} />
          )}
          {Math.abs(posChange) !== 1 && opposite && <PremText order={4}>{Math.abs(posChange)}</PremText>}
        </>
      )}
    </View>
  );
};

const PlayerScore = ({ player, userId, position, gw, leagueSize }: Props) => {
  return (
    <View style={[styles.container, player.id === userId && styles.myScore]}>
      <View style={[styles.scoreWrapper, styles.shrinker]}>
        <View
          style={[
            styles.scoreWrapper,
            styles.positionWrapper,
            leagueSize >= 10 ? scoreboardWidths.between10and100WrapperWidth : scoreboardWidths.under10WrapperWidth,
          ]}
        >
          <View
            style={[
              styles.position,
              leagueSize >= 10 ? scoreboardWidths.between10and100Width : scoreboardWidths.under10Width,
            ]}
          >
            <PremText>{position}</PremText>
          </View>
          {renderPositionChange(player, gw)}
        </View>

        <View style={[styles.shrinker]}>
          <PremText overflowing>{player.name}</PremText>
        </View>
      </View>

      <View style={[styles.scoreWrapper, styles.rightSide, scoreboardWidths.pointsWidth]}>
        {renderPointChange(gw, player)}
        <PremText>{`x${player.scores[gw - 1].total < 10 ? player.scores[gw - 1].total.toFixed(2) : player.scores[gw - 1].total.toFixed(1)}`}</PremText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
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
  scoreWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },

  positionWrapper: {
    justifyContent: 'space-between',
    paddingRight: 6,
  },

  rightSide: {
    justifyContent: 'space-between',
  },

  shrinker: {
    flexShrink: 1,
  },
});

export default PlayerScore;
