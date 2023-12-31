import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

import { colors, globalStyles } from '../../../styles/styles';
import PremButton from '../../../components/basic/PremButton';
import LeagueItem from '../../../components/leagueMenu/LeagueItem';
import { router } from 'expo-router';
import { useAppSelector } from '../../../redux/hooks';
import { League } from '../../../types/League';
import PremText from '../../../components/basic/PremText';
import GameweekShifter from '../../../components/leagueId/GameweekShifter';

const renderLeagues = (leagues: League[]) => {
  return leagues.map((league) => (
    <LeagueItem
      key={league.id}
      league={league}
      onPress={() => router.push(`/main/leagues/${league.id}`)}
    />
  ));
};

const currentGW = 3;

export default function Page() {
  const leagues = useAppSelector((state) => state.leagues.items);
  const [selectedGW, setSelectedGW] = useState<number>(currentGW);

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
    <View style={[styles.leagueScreen, globalStyles.container]}>
      <View>
        <GameweekShifter selectedGW={selectedGW} setSelectedGW={setSelectedGW} />
        <View style={[styles.gwScores]}>
          <View style={[styles.secondaryCard, globalStyles.shadow]}>
            <PremText order={4}>Avg</PremText>
            <PremText>x5.12</PremText>
          </View>
          <View style={[styles.mainCard, globalStyles.shadow]}>
            <PremText>My score</PremText>
            <PremText order={2}>x4.69</PremText>
          </View>
          <View style={[styles.secondaryCard, globalStyles.shadow]}>
            <PremText order={4}>Max</PremText>
            <PremText order={3}>x12.19</PremText>
          </View>
        </View>
      </View>
      {leagues.length !== 0 ? (
        <View style={{ maxHeight: 360 }}>
          <ScrollView style={{ flexGrow: 0 }}>
            <View style={styles.leagueWrapper}>{renderLeagues(leagues)}</View>
          </ScrollView>
        </View>
      ) : (
        <View style={{ marginBottom: 12 }}>
          <PremText order={2} centered>
            Create or join a league
          </PremText>
        </View>
      )}
      <View style={styles.actionWrapper}>
        <PremButton
          onPress={() => {
            router.push('/main/leagues/CreateLeague');
          }}
        >
          Create
        </PremButton>
        <PremButton
          onPress={() => {
            router.push('/main/leagues/JoinLeague');
          }}
        >
          Join
        </PremButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gwScores: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginVertical: 12,
  },
  secondaryCard: {
    height: 60,
    width: 80,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.charcoal[2],
    borderRadius: 4,
  },

  mainCard: {
    height: 72,
    width: 108,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.charcoal[3],
    borderRadius: 4,
  },

  leagueScreen: {
    display: 'flex',
    gap: 8,
  },

  leagueWrapper: {
    marginVertical: 16,
    gap: 12,
  },

  actionWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
