import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';

import { colors, scoreboardWidths } from '../../styles/styles';
import User from '../../types/User';
import PremText from '../basic/PremText';
import PlayerScore from './PlayerScore';
import ScoreboardFooter from './ScoreboardFooter';

interface Props {
  players: User[];
  gw: number;
  myId?: string;
}

const Scoreboard = ({ players, gw, myId }: Props) => {
  const playerItems = players.map((player, index) => (
    <PlayerScore
      position={index + 1}
      player={player}
      userId={myId}
      key={player.id}
      gw={gw}
      leagueSize={players.length}
    />
  ));

  return (
    <>
      <View style={styles.scoreboard}>
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
        <ScrollView style={{ maxHeight: 400 }}>
          <View style={styles.scoreboardScrollWrapper}>{playerItems}</View>
        </ScrollView>
      </View>
      <ScoreboardFooter players={players} myId={myId} />
    </>
  );
};

const styles = StyleSheet.create({
  scoreboard: {
    backgroundColor: colors.charcoal[2],
    padding: 2,
  },
  scoreboardScrollWrapper: {
    display: 'flex',
    gap: 8,
  },
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

export default Scoreboard;
