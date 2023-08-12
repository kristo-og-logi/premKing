import { StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import { colors, globalStyles } from '../../styles/styles';
import { fetchLeagueById } from '../../utils/fetchLeague';
import { SelectedLeague } from '../../types/League';
import PremText from '../../components/basic/PremText';
import PlayerScore from '../../components/leagueId/PlayerScore';
import { Player } from '../../types/Player';

const Scoreboard = (players: Player[]) => {
  console.log('players are', players);
  const playerItems = players.map((player) => <PlayerScore player={player} key={player.id} />);

  return (
    <View style={styles.scoreboard}>
      <View style={styles.scoreboardHeader}>
        <PremText>Scoreboard</PremText>
      </View>
      {playerItems}
    </View>
  );
};

const LeagueView = () => {
  const { leagueId } = useLocalSearchParams();
  const [league, setLeague] = useState<SelectedLeague>();

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
          <PremText>{'SelectedLeague: ' + leagueId}</PremText>
          <PremText>{league.name}</PremText>
          <PremText>{league.players.length + ' players'}</PremText>
          {Scoreboard(league.players)}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  scoreboard: {
    display: 'flex',
    gap: 8,
    backgroundColor: colors.charcoal[2],
    padding: 2,
  },
  scoreboardHeader: {
    width: 'auto',
    display: 'flex',
    justifyContent: 'center',
  },
});

export default LeagueView;
