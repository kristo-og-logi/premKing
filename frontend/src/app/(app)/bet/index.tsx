import React, { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
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

  const [selectedGW, setSelectedGW] = useState<number>(20);

  useEffect(() => {
    dispatch(getFixtures(selectedGW));
  }, [selectedGW]);

  const renderMatches = () => {
    return fixtureSlice.fixtures.map((fixture) => <MatchUp key={fixture.id} fixture={fixture} />);
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
      <Confirm />
    </View>
  );
};

export default Bet;
