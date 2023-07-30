import { View, Text } from 'react-native';
import React from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import { styles } from '../../styles/styles';

const SelectedLeague = () => {
  const { leagueId } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{ headerTitle: typeof leagueId === 'string' ? leagueId : 'bad error' }} // can we make this not so ugly?
      />
      <Text>{'SelectedLeague: ' + leagueId}</Text>
    </View>
  );
};

export default SelectedLeague;
