import { ScrollView, StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';

import { colors, globalStyles } from '../../styles/styles';
import { fetchLeagueById } from '../../utils/fetchLeague';
import { SelectedLeague } from '../../types/League';
import PremText from '../../components/basic/PremText';
import PlayerScore from '../../components/leagueId/PlayerScore';
import { Player } from '../../types/Player';
import PremButton from '../../components/basic/PremButton';

const currentGW = 3;

const sortPlayers = (players: Player[]) => {
  return players.sort((a, b) => (a.points >= b.points ? -1 : 1));
};

const calculateTimeUntilGW = (gwNumber: number, currentGW: number) => {
  if (gwNumber < currentGW) return 'Finished';
  if (gwNumber > currentGW) return 'Closed';

  return 'Starts In 3 days, 2 hours';
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
      <ScrollView style={{ maxHeight: 400 }}>
        <View style={styles.scoreboardScrollWrapper}>{playerItems}</View>
      </ScrollView>
    </View>
  );
};

const calculateYourPlace = (players: Player[], userId: string) => {
  return sortPlayers(players).findIndex((player) => player.id === userId) + 1;
};

const LeagueView = () => {
  const { leagueId } = useLocalSearchParams();
  const [league, setLeague] = useState<SelectedLeague>();
  const [selectedGW, setSelectedGW] = useState<number>(currentGW);

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
            <AntDesign
              name="left"
              size={24}
              color={selectedGW > 1 ? colors.gray[0] : colors.gray[2]}
              onPress={() => {
                if (selectedGW > 1) setSelectedGW(selectedGW - 1);
              }}
            />
            <PremText order={1} centered>{`Gameweek ${selectedGW}`}</PremText>
            <AntDesign
              name="right"
              size={24}
              color={selectedGW < 38 ? colors.gray[0] : colors.gray[2]}
              onPress={() => {
                if (selectedGW < 38) setSelectedGW(selectedGW + 1);
              }}
            />
          </View>
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
    paddingVertical: 12,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-around',
  },
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
});

export default LeagueView;
