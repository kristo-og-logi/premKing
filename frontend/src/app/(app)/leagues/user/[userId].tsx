import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import PremText from '../../../../components/basic/PremText';
import { globalStyles } from '../../../../styles/styles';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { getFriendBets } from '../../../../redux/reducers/betReducer';
import type { BetState } from '../../../../redux/reducers/betReducer';
import GameweekShifter from '../../../../components/basic/GameweekShifter';
import FutureGameweekBet from '../../../../components/bet/future/FutureGameweekBet';
import PastGameweekBet from '../../../../components/bet/past/PastGameweekBet';
import { getFixtures } from '../../../../redux/reducers/fixtureReducer';
import { getGameweekStatus } from '../../../../utils/leagueUtils';
import { GameweekStatus } from '../../../../types/Gameweek';
import { calculateTimer, useTimeUntil } from '../../../../utils/timer';

const findHeaderTitle = (betSlice: BetState) => {
  if (betSlice.friendBetsIsLoading) return 'Loading...';
  if (betSlice.friendBetsHasError) return ':(';

  const name = betSlice.friendBets?.friend.name || '';

  const firstName = name.split(' ')[0];
  return `${firstName}'s bets`;
};
const UserBet = () => {
  const { userId } = useLocalSearchParams();

  const dispatch = useAppDispatch();
  const authSlice = useAppSelector((state) => state.auth);
  const betSlice = useAppSelector((state) => state.bets);
  const fixtureSlice = useAppSelector((state) => state.fixtures);
  const gameweekSlice = useAppSelector((state) => state.gameweek);

  const [selectedGW, setSelectedGW] = useState<number>(gameweekSlice.currentGameweek);
  const timeUntil = useTimeUntil(gameweekSlice.allGameweeks[selectedGW - 1].closes);

  useEffect(() => {
    dispatch(getFixtures(selectedGW));
  }, [selectedGW]);

  useEffect(() => {
    if (!userId) return;
    if (typeof userId !== 'string') return;

    dispatch(getFriendBets({ userId: userId, gw: 1, token: authSlice.token }));
  }, [userId]);

  const renderGameweekBet = () => {
    const gwStatus = getGameweekStatus(gameweekSlice.allGameweeks[selectedGW - 1]);

    // if the gameweek is not closed, we will not display any bets
    if (
      selectedGW > gameweekSlice.currentGameweek ||
      (selectedGW === gameweekSlice.currentGameweek && gwStatus === GameweekStatus.OPEN)
    )
      return (
        <>
          <PremText centered order={2}>{`Closes in ${timeUntil}`}</PremText>
          <PremText
            order={3}
            centered
            padding={32}
          >{`You can view ${findHeaderTitle(betSlice)} once GW${selectedGW} closes`}</PremText>
        </>
      );

    return (
      <PastGameweekBet
        fixtures={fixtureSlice.fixtures}
        bets={betSlice.friendBets?.tickets[selectedGW - 1].bets || []}
      />
    );
  };

  return (
    <View style={globalStyles.container}>
      <Stack.Screen options={{ headerTitle: findHeaderTitle(betSlice) }} />
      {betSlice.friendBetsIsLoading ? (
        <PremText>Loading...</PremText>
      ) : betSlice.friendBetsHasError ? (
        <PremText>Error loading bets</PremText>
      ) : (
        <>
          <GameweekShifter
            selectedGW={selectedGW}
            setSelectedGameweek={(newGw) => {
              setSelectedGW(newGw);
            }}
          />
          {(betSlice.friendBets?.tickets[selectedGW - 1].bets || []).length > 0 ? (
            <View style={{ marginBottom: 8, marginTop: -8 }}>
              <PremText
                centered
                order={2}
              >{`score: x${betSlice.friendBets?.tickets[selectedGW - 1].score.toFixed(2)}`}</PremText>
            </View>
          ) : (
            <></>
          )}
          <ScrollView>
            {fixtureSlice.isLoading ? (
              <PremText>loading...</PremText>
            ) : fixtureSlice.hasError ? (
              <PremText>Error</PremText>
            ) : (
              renderGameweekBet()
            )}
          </ScrollView>
        </>
      )}
    </View>
  );
};

export default UserBet;
