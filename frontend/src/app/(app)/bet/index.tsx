import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { globalStyles } from '../../../styles/styles';
import { MatchUp } from '../../../components/bet/MatchUp';
import { Confirm } from '../../../components/bet/Confirm';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { getFixtures } from '../../../redux/reducers/fixtureReducer';
import PremText from '../../../components/basic/PremText';
import GameweekShifter from '../../../components/basic/GameweekShifter';

const Bet = () => {
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

  const renderMatches = () => {
    return (
      <View style={styles.fixtureList}>
        {fixtureSlice.fixtures.map((fixture) => (
          <MatchUp selectedGW={selectedGW} key={fixture.id} fixture={fixture} />
        ))}
      </View>
    );
  };

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
        ) : (
          <>{renderMatches()}</>
        )}
      </ScrollView>
      <Confirm selectedGW={selectedGW} />
    </View>
  );
};

export default Bet;

const styles = StyleSheet.create({
  fixtureList: {
    gap: 12,
  },
});
