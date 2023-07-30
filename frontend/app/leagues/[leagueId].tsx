import { View, Text } from 'react-native';
import React from 'react';
import { useLocalSearchParams } from 'expo-router';

const SelectedLeague = () => {
  const { leagueId } = useLocalSearchParams();
  return (
    <View>
      <Text>{'SelectedLeague: ' + leagueId}</Text>
    </View>
  );
};

export default SelectedLeague;
