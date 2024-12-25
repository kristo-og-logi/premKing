import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';

import { colors } from '../../styles/styles';
import PlayerScore from './PlayerScore';
import ScoreboardFooter from './ScoreboardFooter';
import type { Player } from '../../types/Player';
import ScoreboardHeader from './ScoreboardHeader';

interface Props {
  players: Player[];
  gw: number;
  myId?: string;
}

const Scoreboard = ({ players, gw, myId }: Props) => {
  const playerItems = [...players]
    .sort((a, b) => (a.scores[gw - 1].place > b.scores[gw - 1].place ? 1 : -1))
    .map((player, index) => (
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
        <ScoreboardHeader gw={gw} players={players} />
        <ScrollView style={{ maxHeight: 400 }}>
          <View style={styles.scoreboardScrollWrapper}>{playerItems}</View>
        </ScrollView>
      </View>
      <ScoreboardFooter gw={gw} players={players} myId={myId} />
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

  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
  },
});

export default Scoreboard;
