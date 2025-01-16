import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import PremText from '../../../components/basic/PremText';
import { globalStyles } from '../../../styles/styles';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { getFriendBets } from '../../../redux/reducers/betReducer';
import GameweekShifter from '../../../components/basic/GameweekShifter';
import FutureGameweekBet from '../../../components/bet/future/FutureGameweekBet';
import PastGameweekBet from '../../../components/bet/past/PastGameweekBet';
import { getFixtures } from '../../../redux/reducers/fixtureReducer';

const UserBet = () => {
  const { userId } = useLocalSearchParams();

  const dispatch = useAppDispatch();
  const authSlice = useAppSelector((state) => state.auth);
  const betSlice = useAppSelector((state) => state.bets);
  const fixtureSlice = useAppSelector((state) => state.fixtures);
  const gameweekSlice = useAppSelector((state) => state.gameweek);

  const [selectedGW, setSelectedGW] = useState<number>(gameweekSlice.currentGameweek);

  useEffect(() => {
    dispatch(getFixtures(selectedGW));
  }, [selectedGW]);

  useEffect(() => {
    if (!userId) return;
    if (typeof userId !== 'string') return;

    dispatch(getFriendBets({ userId: userId, gw: 1, token: authSlice.token }));
  }, [userId]);

  return (
    <View style={globalStyles.container}>
      <Stack.Screen options={{ headerTitle: `${betSlice.friendBets?.friend.name}'s bets` }} />
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
          {betSlice.bets[selectedGW - 1].bets.length > 0 ? (
            <View style={{ marginBottom: 8, marginTop: -8 }}>
              <PremText centered order={2}>{`score: x${betSlice.bets[selectedGW - 1].score.toFixed(2)}`}</PremText>
            </View>
          ) : (
            <></>
          )}
          <ScrollView>
            {fixtureSlice.isLoading ? (
              <PremText>loading...</PremText>
            ) : fixtureSlice.hasError ? (
              <PremText>Error</PremText>
            ) : selectedGW > gameweekSlice.currentGameweek ? (
              <FutureGameweekBet />
            ) : (
              <PastGameweekBet />
            )}
          </ScrollView>
        </>
      )}
    </View>
  );
};

export default UserBet;
