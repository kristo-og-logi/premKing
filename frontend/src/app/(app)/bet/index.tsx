import React, { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';

import { globalStyles } from '../../../styles/styles';
import { Confirm } from '../../../components/bet/Confirm';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { getFixtures } from '../../../redux/reducers/fixtureReducer';
import PremText from '../../../components/basic/PremText';
import GameweekShifter from '../../../components/basic/GameweekShifter';
import { Bet } from '../../../types/Bet';
import CurrentGameweekBet from '../../../components/bet/current/CurrentGameweekBet';
import PastGameweekBet from '../../../components/bet/past/PastGameweekBet';
import FutureGameweekBet from '../../../components/bet/future/FutureGameweekBet';
import { getBets } from '../../../redux/reducers/betReducer';

const BetScreen = () => {
  const dispatch = useAppDispatch();
  const fixtureSlice = useAppSelector((state) => state.fixtures);
  const gameweekSlice = useAppSelector((state) => state.gameweek);
  const authSlice = useAppSelector((state) => state.auth);
  const betSlice = useAppSelector((state) => state.bets);

  const [selectedGW, setSelectedGW] = useState<number>(gameweekSlice.gameweek);

  useEffect(() => {
    dispatch(getFixtures(selectedGW));
    dispatch(getBets({ gameweek: selectedGW, token: authSlice.token }));
  }, [selectedGW]);

  useEffect(() => {
    setSelectedGW(gameweekSlice.gameweek);
  }, [gameweekSlice.gameweek]);

  const [bet, setBet] = useState<Bet[]>([]);

  useEffect(() => {
    setBet(betSlice.bets);
  }, [betSlice.bets]);

  return (
    <View style={globalStyles.container}>
      <GameweekShifter selectedGW={selectedGW} setSelectedGW={setSelectedGW} />
      {betSlice.score && !betSlice.isLoading ? (
        <View style={{ marginBottom: 8, marginTop: -8 }}>
          <PremText centered order={2}>{`score: x${betSlice.score.toFixed(2)}`}</PremText>
        </View>
      ) : (
        <></>
      )}
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        {fixtureSlice.isLoading ? (
          <PremText>loading...</PremText>
        ) : fixtureSlice.hasError ? (
          <PremText>Error</PremText>
        ) : fixtureSlice.fixtures.length == 0 ? (
          <PremText>no fixture for this gameweek</PremText>
        ) : selectedGW === gameweekSlice.gameweek ? (
          <CurrentGameweekBet bet={bet} setBet={setBet} />
        ) : selectedGW >= gameweekSlice.gameweek ? (
          <FutureGameweekBet />
        ) : (
          <PastGameweekBet />
        )}
      </ScrollView>
      <Confirm selectedGW={selectedGW} bet={bet} />
    </View>
  );
};

export default BetScreen;
