import { BackHandler, ScrollView, StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Stack, useLocalSearchParams, useNavigation } from 'expo-router';

import { colors, globalStyles, scoreboardWidths } from '../../../styles/styles';
// import { fetchLeagueById } from '../../../utils/fetchLeague';
// import { SelectedLeague } from '../../../types/League';
import PremText from '../../../components/basic/PremText';
import PlayerScore from '../../../components/leagueId/PlayerScore';
import { Player, PlayerPoints, ScoreboardPlayer } from '../../../types/Player';
import PremButton from '../../../components/basic/PremButton';
import GameweekShifter from '../../../components/basic/GameweekShifter';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { getSelectedLeague, unselect } from '../../../redux/reducers/leaguesReducer';
import User from '../../../types/User';
import Gameweek from '../../../types/Gameweek';

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

const calculateTimeUntilGW = (gameweek: Gameweek) => {
  const now = new Date();
  const opens = new Date(gameweek.opens);
  const closes = new Date(gameweek.closes);
  const finishes = new Date(gameweek.finishes);

  // "now" can be inbetween any of these 3 times, giving us four cases
  // opens - closes - finishes
  if (now < opens)
    return `Opens on ${opens.toDateString()}, ${opens.getHours()}:${opens.getMinutes()}`;

  if (finishes < now)
    return `Finished on ${finishes.toDateString()}, ${finishes.getHours()}:${finishes.getMinutes()}`;

  if (now < closes) return `Currently open`;

  return `Closed on ${closes.toDateString()}, ${closes.getHours()}:${closes.getMinutes()}`;
};

const Scoreboard = (players: User[], gw: number, myId: string) => {
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

// const calculateYourPlace = (players: ScoreboardPlayer[], userId: string) => {
//   return players.findIndex((player) => player.id === userId) + 1;
// };
const calculateYourPlace = (players: User[], userId: string) => {
  return players.findIndex((player) => player.id === userId) + 1;
};

const calculateGwAction = (gameweek: Gameweek): string => {
  return isOpen(gameweek) ? 'Create bet' : 'Locked';
};

const isOpen = (gameweek: Gameweek): boolean => {
  const now = new Date();
  const opens = new Date(gameweek.opens);
  const closes = new Date(gameweek.closes);

  return opens < now && now < closes;
};

const LeagueView = () => {
  const navigation = useNavigation();
  const { leagueId } = useLocalSearchParams();

  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const leagueSlice = useAppSelector((state) => state.leagues);
  const gameweekSlice = useAppSelector((state) => state.gameweek);

  // const [league, setLeague] = useState<SelectedLeague>();
  const [selectedGW, setSelectedGW] = useState<number>(gameweekSlice.gameweek);
  // const [scoreboardedPlayers, setScoreboardedPlayers] = useState<ScoreboardPlayer[]>([]);

  useEffect(() => {
    // Event listener for the navigation 'beforeRemove' event
    const beforeRemoveListener = navigation.addListener('beforeRemove', (e) => {
      e.preventDefault();
      dispatch(unselect()); // unselect the league
      navigation.dispatch(e.data.action); // default back action
    });

    // Event listener for the hardware back button on Android
    const backHandlerListener = BackHandler.addEventListener('hardwareBackPress', () => {
      dispatch(unselect()); // unselect the league
      return false; // allows the default back action
    });

    // Clean up the listeners on component unmount
    return () => {
      beforeRemoveListener();
      backHandlerListener.remove();
    };
  }, [navigation]);

  useEffect(() => {
    if (!leagueId) return;
    if (typeof leagueId !== 'string') return;

    dispatch(getSelectedLeague({ leagueId, token: auth.token }));
  }, [leagueId]);

  // useEffect(() => {
  //   if (!league) return;
  //   setScoreboardedPlayers(getScoreboardedPlayers(league.players, selectedGW));
  // }, [selectedGW]);

  return (
    <View style={globalStyles.container}>
      <Stack.Screen
        options={{
          headerTitle: leagueSlice.selectedIsLoading
            ? 'loading...'
            : leagueSlice.selectedLeague?.name || 'unnamed league',
        }}
      />
      {leagueSlice.selectedIsLoading ? (
        <PremText>Loading...</PremText>
      ) : leagueSlice.selectedHasError || !leagueSlice.selectedLeague ? (
        <PremText>Error occured</PremText>
      ) : (
        <>
          <GameweekShifter selectedGW={selectedGW} setSelectedGW={setSelectedGW} />
          <View style={styles.betWrapper}>
            <PremText centered>
              {calculateTimeUntilGW(gameweekSlice.allGameweeks[selectedGW - 1])}
            </PremText>
            <PremButton
              disabled={!isOpen(gameweekSlice.allGameweeks[selectedGW - 1])}
              onPress={() => {
                console.log('bet created');
              }}
            >
              {calculateGwAction(gameweekSlice.allGameweeks[selectedGW - 1])}
            </PremButton>
          </View>
          {Scoreboard(leagueSlice.selectedLeague.users, selectedGW, auth.user.id)}
          <View style={styles.statsWrapper}>
            <PremText order={4}>{`your position: ${calculateYourPlace(
              leagueSlice.selectedLeague.users,
              auth.user?.id
            )}`}</PremText>
            <PremText
              order={4}
            >{`total players: ${leagueSlice.selectedLeague.users.length}`}</PremText>
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
