import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import { globalStyles } from '../../styles/styles';
import { fetchLeagueById } from '../../utils/fetchLeague';
import { SelectedLeague } from '../../types/League';
import PremText from '../../components/basic/PremText';

const SelectedLeague = () => {
  const { leagueId } = useLocalSearchParams();
  const [league, setLeague] = useState<SelectedLeague>();

  useEffect(() => {
    fetchLeagueById(leagueId as string)
      .then((data) => {
        console.log('league found:', data);
        setLeague(data);
      })
      .catch((error) => {
        console.log('fetch league error in [leagueId]');
      });
  }, [leagueId]);

  if (!league) return <PremText>Loading...</PremText>;

  return (
    <View style={globalStyles.container}>
      <Stack.Screen
        options={{ headerTitle: typeof leagueId === 'string' ? leagueId : 'bad error' }} // can we make this not so ugly?
      />
      <PremText>{'SelectedLeague: ' + leagueId}</PremText>
      <PremText>{league.name}</PremText>
      <PremText>{league.players.length + ' players'}</PremText>
    </View>
  );
};

export default SelectedLeague;
