import React, { useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { globalStyles } from '../../../styles/styles';
import { MatchUp } from '../../../components/bet/MatchUp';
import { Gameweek } from '../../../components/bet/Gameweek';
import { Confirm } from '../../../components/bet/Confirm';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { getFixtures } from '../../../redux/reducers/fixtureReducer';
import PremText from '../../../components/basic/PremText';

const Bet = () => {
  const dispatch = useAppDispatch();
  const fixtureSlice = useAppSelector((state) => state.fixtures);

  useEffect(() => {
    if (fixtureSlice.fixtures.length == 0) dispatch(getFixtures(10));
  }, []);

  const renderMatches = () => {
    return fixtureSlice.fixtures.map((fixture) => <MatchUp key={fixture.id} fixture={fixture} />);
  };

  return (
    <View style={globalStyles.container}>
      <Gameweek />
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
