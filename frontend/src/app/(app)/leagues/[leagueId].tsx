import { BackHandler, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Stack, useLocalSearchParams, useNavigation } from 'expo-router';

import { globalStyles } from '../../../styles/styles';
import PremText from '../../../components/basic/PremText';
import GameweekShifter from '../../../components/basic/GameweekShifter';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { getSelectedLeague, unselect } from '../../../redux/reducers/leaguesReducer';
import Scoreboard from '../../../components/leagueId/Scoreboard';
import BetInfo from '../../../components/leagueId/BetInfo';

const LeagueView = () => {
  const navigation = useNavigation();
  const { leagueId } = useLocalSearchParams();

  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const leagueSlice = useAppSelector((state) => state.leagues);
  const gameweekSlice = useAppSelector((state) => state.gameweek);
  const betSlice = useAppSelector((state) => state.bets);

  const [selectedGW, setSelectedGW] = useState<number>(gameweekSlice.currentGameweek);

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
          <GameweekShifter selectedGW={selectedGW} setSelectedGameweek={setSelectedGW} />
          <BetInfo selectedGW={selectedGW} bets={betSlice.bets[selectedGW - 1].bets || []} />
          <Scoreboard
            players={leagueSlice.selectedLeague.users}
            gw={selectedGW}
            myId={auth.user?.id}
          />
        </>
      )}
    </View>
  );
};

export default LeagueView;
