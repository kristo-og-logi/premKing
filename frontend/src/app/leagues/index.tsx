import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';

import { globalStyles } from '../../styles/styles';
import PremButton from '../../components/basic/PremButton';
import LeagueItem from '../../components/leagueMenu/LeagueItem';

const init = [
  { id: 'asdf', name: 'theleague', place: 4, total: 8 },
  { id: 'ABCD', name: 'league 2', place: 1, total: 3 },
];

const renderLeagues = (leagues) => {
  return leagues.map((league) => <LeagueItem key={league.id} league={league} />);
};

export default function Page() {
  const [leagues, setLeagues] = useState(init);

  return (
    <View style={[styles.leagueList, globalStyles.container]}>
      {renderLeagues(leagues)}
      <View style={styles.actionWrapper}>
        <PremButton onPress={() => console.log('created')}>Create League</PremButton>
        <PremButton onPress={() => console.log('joined')}>Join League</PremButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  leagueList: {
    display: 'flex',
    gap: 8,
  },

  actionWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
