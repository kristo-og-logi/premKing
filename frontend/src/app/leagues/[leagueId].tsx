import { StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import { colors, globalStyles } from '../../styles/styles';
import { fetchLeagueById } from '../../utils/fetchLeague';
import { SelectedLeague } from '../../types/League';
import PremText from '../../components/basic/PremText';
import PlayerScore from '../../components/leagueId/PlayerScore';
import { Player } from '../../types/Player';

const sortPlayers = (players: Player[]) => {
  return players.sort((a, b) => (a.points >= b.points ? -1 : 1));
};

const Scoreboard = (players: Player[]) => {
  const sortedPlayers = sortPlayers(players);
  const playerItems = sortedPlayers.map((player, index) => (
    <PlayerScore position={index + 1} player={player} userId={'EXAMPLE'} key={player.id} />
  ));

  return (
    <View style={styles.scoreboard}>
      <View style={styles.scoreboardHeader}>
        <PremText centered>Scoreboard</PremText>
      </View>
      {playerItems}
    </View>
  );
};

const calculateYourPlace = (players: Player[], userId: string) => {
  return sortPlayers(players).findIndex((player) => player.id === userId) + 1;
};

const LeagueView = () => {
  const { leagueId } = useLocalSearchParams();
  const [league, setLeague] = useState<SelectedLeague>();

  const gameweekNumber = 3;

  useEffect(() => {
    fetchLeagueById(leagueId as string)
      .then((data) => {
        console.log('league found:', data);
        setLeague(data);
      })
      .catch((error) => {
        console.log('fetch league error in [leagueId]', error);
      });
  }, [leagueId]);

  return (
    <View style={globalStyles.container}>
      <Stack.Screen
        options={{ headerTitle: league?.name || 'selected league' }} // can we make this not so ugly?
      />
      {!league ? (
        <PremText>Loading...</PremText>
      ) : (
        <>
          <View style={styles.gameweekSection}>
            <PremText order={1} centered>{`Gameweek ${gameweekNumber}`}</PremText>
          </View>
          {Scoreboard(league.players)}
          <View style={styles.statsWrapper}>
            <PremText order={4}>{`your position: ${calculateYourPlace(
              league.players,
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
  gameweekSection: {
    paddingVertical: 20,
  },
  scoreboard: {
    display: 'flex',
    gap: 8,
    backgroundColor: colors.charcoal[2],
    padding: 2,
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
});

export default LeagueView;
