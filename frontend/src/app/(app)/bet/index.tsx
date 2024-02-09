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

const BetScreen = () => {
  const dispatch = useAppDispatch();
  const fixtureSlice = useAppSelector((state) => state.fixtures);
  const gameweekSlice = useAppSelector((state) => state.gameweek);

  const [selectedGW, setSelectedGW] = useState<number>(gameweekSlice.gameweek);

  useEffect(() => {
    dispatch(getFixtures(selectedGW));
  }, [selectedGW]);

  useEffect(() => {
    setSelectedGW(gameweekSlice.gameweek);
  }, [gameweekSlice.gameweek]);

  const [bet, setBet] = useState<Bet[]>([]);

  useEffect(() => {
    console.log('bet: ', bet);
  }, [bet]);

  return (
    <View style={globalStyles.container}>
      <GameweekShifter selectedGW={selectedGW} setSelectedGW={setSelectedGW} />
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
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
      <Confirm selectedGW={selectedGW} />
    </View>
  );
};

export default BetScreen;
