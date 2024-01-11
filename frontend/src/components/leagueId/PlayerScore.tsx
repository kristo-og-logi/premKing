import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import PremText from '../basic/PremText';
import { colors, scoreboardWidths } from '../../styles/styles';
// import { ScoreboardPlayer } from '../../types/Player';
import User from '../../types/User';

interface Props {
  player: User;
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
  // console.log(
  //   `player ${player.name}, position ${position}, posChange ${player.posChange}, prevPos: ${player.prevPosition}`
  // );
  return (
    <View style={[styles.container, player.id === userId && styles.myScore]}>
      <View style={[styles.scoreWrapper, styles.shrinker]}>
        <View
          style={[
            styles.scoreWrapper,
            styles.positionWrapper,
            leagueSize >= 10
              ? scoreboardWidths.between10and100WrapperWidth
              : scoreboardWidths.under10WrapperWidth,
          ]}
        >
          <View
            style={[
              styles.position,
              leagueSize >= 10
                ? scoreboardWidths.between10and100Width
                : scoreboardWidths.under10Width,
            ]}
          >
            <PremText>{position}</PremText>
          </View>
          {/* {renderPositionChange(player.posChange, gw)} */}
          {renderPositionChange(0, gw)}
        </View>

        <View style={[styles.shrinker]}>
          <PremText overflowing>{player.name}</PremText>
        </View>
      </View>

      <View style={[styles.scoreWrapper, styles.rightSide, scoreboardWidths.pointsWidth]}>
        {/* {renderPointChange(player.points, player.prevPoints)} */}
        {renderPointChange(1, 0)}
        {/* <PremText>{player.points}</PremText> */}
        <PremText>{0}</PremText>
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
