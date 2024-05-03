import { BackHandler, StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Stack, useLocalSearchParams, useNavigation, useRouter } from 'expo-router';

import { globalStyles } from '../../../styles/styles';
import PremText from '../../../components/basic/PremText';
import PremButton from '../../../components/basic/PremButton';
import GameweekShifter from '../../../components/basic/GameweekShifter';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { getSelectedLeague, unselect } from '../../../redux/reducers/leaguesReducer';
import Scoreboard from '../../../components/leagueId/Scoreboard';
import {
  calculateGwAction,
  calculateTimeUntilGW,
  calculateYourPlace,
  isOpen,
} from '../../../utils/leagueUtils';

const LeagueView = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const { leagueId } = useLocalSearchParams();

  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const leagueSlice = useAppSelector((state) => state.leagues);
  const gameweekSlice = useAppSelector((state) => state.gameweek);

  // const [league, setLeague] = useState<SelectedLeague>();
  const [selectedGW, setSelectedGW] = useState<number>(gameweekSlice.currentGameweek);
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
                router.replace('bet');
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
  betWrapper: {
    padding: 12,
    display: 'flex',
    gap: 4,
    alignItems: 'center',
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
});

export default LeagueView;
