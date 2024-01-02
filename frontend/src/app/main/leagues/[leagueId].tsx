import { ScrollView, StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';

import { colors, globalStyles, scoreboardWidths } from '../../../styles/styles';
import { fetchLeagueById } from '../../../utils/fetchLeague';
import { SelectedLeague } from '../../../types/League';
import PremText from '../../../components/basic/PremText';
import PlayerScore from '../../../components/leagueId/PlayerScore';
import { Player, PlayerPoints, ScoreboardPlayer } from '../../../types/Player';
import PremButton from '../../../components/basic/PremButton';
import GameweekShifter from '../../../components/leagueId/GameweekShifter';

// put this into context or redux?
const currentGW = 3;

const calculatePoints = (points: PlayerPoints[], gw: number) => {
  return points.reduce((sum, curr) => {
    if (curr.gw > gw) return sum;
    return (sum += curr.points);
  }, 0);
};

const getScoreboardedPlayers = (players: Player[], selectedGw: number): ScoreboardPlayer[] => {
  const scoreboardPlayers = players.map((player) => {
    const playerPoints = calculatePoints(player.points, selectedGw);
    const playerPrevPoints = calculatePoints(player.points, selectedGw - 1);

    return { id: player.id, name: player.name, points: playerPoints, prevPoints: playerPrevPoints };
  });

  const copy = scoreboardPlayers.slice();

  const finalPlayers = scoreboardPlayers.map((player) => {
    const prevPos =
      copy
        .sort((a, b) => (a.prevPoints >= b.prevPoints ? -1 : 1))
        .findIndex((p) => p.id === player.id) + 1;

    const currPos =
      copy.sort((a, b) => (a.points >= b.points ? -1 : 1)).findIndex((p) => p.id === player.id) + 1;

    return { ...player, position: currPos, prevPosition: prevPos, posChange: prevPos - currPos };
  });

  return finalPlayers.sort((a, b) => (a.points >= b.points ? -1 : 1));
};

const calculateTimeUntilGW = (gwNumber: number, currentGW: number) => {
  if (gwNumber < currentGW) return 'Finished';
  if (gwNumber > currentGW) return 'Closed';

  return 'Starts In 3 days, 2 hours';
};

const Scoreboard = (players: ScoreboardPlayer[], gw: number) => {
  const playerItems = players.map((player, index) => (
    <PlayerScore
      position={index + 1}
      player={player}
      userId={'EXAMPLE'}
      key={player.id}
      gw={gw}
      leagueSize={players.length}
    />
  ));

  return (
    <View style={styles.scoreboard}>
      <View style={styles.scoreboardHeader}>
        <PremText centered>Scoreboard</PremText>
      </View>
      <View style={styles.header}>
        <View style={[styles.textWrapper]}>
          <View
            style={[
              styles.textWrapper,
              // globalStyles.border,
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
  );
};

const calculateYourPlace = (players: ScoreboardPlayer[], userId: string) => {
  return players.findIndex((player) => player.id === userId) + 1;
};

const LeagueView = () => {
  const { leagueId } = useLocalSearchParams();
  const [league, setLeague] = useState<SelectedLeague>();
  const [selectedGW, setSelectedGW] = useState<number>(currentGW);
  const [scoreboardedPlayers, setScoreboardedPlayers] = useState<ScoreboardPlayer[]>([]);

  useEffect(() => {
    fetchLeagueById(leagueId as string)
      .then((data) => {
        setLeague(data);
        setScoreboardedPlayers(getScoreboardedPlayers(data.players, selectedGW));
      })
      .catch((error) => {
        console.log('fetch league error in [leagueId]', error);
      });
  }, [leagueId]);

  useEffect(() => {
    if (!league) return;
    setScoreboardedPlayers(getScoreboardedPlayers(league.players, selectedGW));
  }, [selectedGW]);

  return (
    <View style={globalStyles.container}>
      <Stack.Screen
        options={{ headerTitle: league?.name || 'selected league' }} // can we make this not so ugly?
      />
      {!league ? (
        <PremText>Loading...</PremText>
      ) : (
        <>
          <GameweekShifter selectedGW={selectedGW} setSelectedGW={setSelectedGW} />
          <View style={styles.betWrapper}>
            <PremText centered>{calculateTimeUntilGW(selectedGW, currentGW)}</PremText>
            <PremButton
              onPress={() => {
                console.log('bet created');
              }}
            >
              Create Bet
            </PremButton>
          </View>
          {Scoreboard(scoreboardedPlayers, selectedGW)}
          <View style={styles.statsWrapper}>
            <PremText order={4}>{`your position: ${calculateYourPlace(
              scoreboardedPlayers,
              'EXAMPLE'
            )}`}</PremText>
            <PremText order={4}>{`total players: ${league.players.length}`}</PremText>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  scoreboard: {
    backgroundColor: colors.charcoal[2],
    padding: 2,
  },
  betWrapper: {
    padding: 12,
    display: 'flex',
    gap: 4,
    alignItems: 'center',
  },
  scoreboardScrollWrapper: {
    display: 'flex',
    gap: 8,
  },
  scoreboardHeader: {
    padding: 4,
  },
  centeredText: {
    textAlign: 'center',
  },

  statsWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 4,
  },

  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
  },

  textWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default LeagueView;
