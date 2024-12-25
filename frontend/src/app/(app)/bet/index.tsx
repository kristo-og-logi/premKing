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
import { setSelectedGameweek } from '../../../redux/reducers/betReducer';

const BetScreen = () => {
  const dispatch = useAppDispatch();
  const fixtureSlice = useAppSelector((state) => state.fixtures);
  const gameweekSlice = useAppSelector((state) => state.gameweek);
  const betSlice = useAppSelector((state) => state.bets);

  const selectedGW = useAppSelector((state) => state.bets).selectedGameweek;

  useEffect(() => {
    dispatch(getFixtures(selectedGW));
  }, [selectedGW]);

  useEffect(() => {
    dispatch(setSelectedGameweek(gameweekSlice.currentGameweek));
  }, [gameweekSlice.currentGameweek]);

  const [bet, setBet] = useState<Bet[]>([]);

  useEffect(() => {
    setBet(betSlice.bets[selectedGW - 1]?.bets || []);
  }, [selectedGW, betSlice.bets]);

  return (
    <View style={globalStyles.container}>
      {betSlice.isLoading ? (
        <PremText>Loading...</PremText>
      ) : (
        <>
          <GameweekShifter
            selectedGW={betSlice.selectedGameweek}
            setSelectedGameweek={(newGw) => dispatch(setSelectedGameweek(newGw))}
          />
          {betSlice.bets[selectedGW - 1].bets.length > 0 ? (
            <View style={{ marginBottom: 8, marginTop: -8 }}>
              <PremText centered order={2}>{`score: x${betSlice.bets[selectedGW - 1].score.toFixed(2)}`}</PremText>
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
            ) : selectedGW === gameweekSlice.currentGameweek ? (
              <CurrentGameweekBet bet={bet} setBet={setBet} />
            ) : selectedGW >= gameweekSlice.currentGameweek ? (
              <FutureGameweekBet />
            ) : (
              <PastGameweekBet />
            )}
          </ScrollView>
          <Confirm selectedGW={selectedGW} bet={bet} setBet={setBet} />
        </>
      )}
    </View>
  );
};

export default BetScreen;
