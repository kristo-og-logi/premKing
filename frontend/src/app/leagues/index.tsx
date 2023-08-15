import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';

import { globalStyles } from '../../styles/styles';
import PremButton from '../../components/basic/PremButton';
import LeagueItem from '../../components/leagueMenu/LeagueItem';
import { router } from 'expo-router';
import { useAppSelector } from '../../hooks';
import { League } from '../../types/League';

const renderLeagues = (leagues: League[]) => {
  return leagues.map((league) => (
    <LeagueItem
      key={league.id}
      league={league}
      onPress={() => router.push(`leagues/${league.id}`)}
    />
  ));
};

export default function Page() {
  const leagues = useAppSelector((state) => state.leagues.items);

  useEffect(() => {
    const fetchLeagues = async () => {
      // const leagues: (League | undefined)[] = await Promise.all(
      //   leagueIds.map(async (id) => {
      //     // change this line later
      //     return init.find((league) => league.id === id);
      //   })
      // );
      // const foundLeagues: League[] = leagues.filter((league) => league !== undefined) as League[];
      // setLeagues(foundLeagues);
    };

    fetchLeagues();
  }, []);

  return (
    <View style={[styles.leagueList, globalStyles.container]}>
      {renderLeagues(leagues)}
      <View style={styles.actionWrapper}>
        <PremButton
          onPress={() => {
            router.push('/leagues/CreateLeague');
          }}
        >
          Create League
        </PremButton>
        <PremButton
          onPress={() => {
            router.push('/leagues/JoinLeague');
          }}
        >
          Join League
        </PremButton>
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
