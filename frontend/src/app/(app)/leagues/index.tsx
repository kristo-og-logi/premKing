import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

import { colors, globalStyles } from '../../../styles/styles';
import PremButton from '../../../components/basic/PremButton';
import LeagueItem from '../../../components/leagueMenu/LeagueItem';
import { router } from 'expo-router';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { League } from '../../../types/League';
import PremText from '../../../components/basic/PremText';
import GameweekShifter from '../../../components/basic/GameweekShifter';
import { getMyLeagues, setJoinLeagueActive } from '../../../redux/reducers/leaguesReducer';
import Scores from '../../../components/leagueMenu/Scores';

const renderLeagues = (leagues: League[], gw: number) => {
  return leagues.map((league) => (
    <LeagueItem
      key={league.id}
      league={league}
      gw={gw}
      onPress={() => router.push(`/leagues/${league.id}`)}
    />
  ));
};

export default function Page() {
  const dispatch = useAppDispatch();
  const gameweekSlice = useAppSelector((state) => state.gameweek);
  const leagueSlice = useAppSelector((state) => state.leagues);
  const [selectedGW, setSelectedGW] = useState<number>(gameweekSlice.currentGameweek);
  const authSlice = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (authSlice.token) dispatch(getMyLeagues(authSlice.token));
  }, [authSlice.token]);

  useEffect(() => {
    setSelectedGW(gameweekSlice.currentGameweek);
  }, [gameweekSlice.currentGameweek]);

  return (
    <View style={[styles.leagueScreen, globalStyles.container]}>
      <View>
        {gameweekSlice.isLoading ? (
          <PremText>Loading...</PremText>
        ) : gameweekSlice.hasError ? (
          <PremText>Error occurred</PremText>
        ) : (
          <>
            <GameweekShifter selectedGW={selectedGW} setSelectedGW={setSelectedGW} />
            <Scores selectedGW={selectedGW} />
          </>
        )}
      </View>
      {leagueSlice.isLoading ? (
        <PremText>Loading leagues...</PremText>
      ) : leagueSlice.hasError ? (
        <PremText>Error fetching leagues</PremText>
      ) : leagueSlice.leagues.length !== 0 ? (
        <View style={{ maxHeight: 360 }}>
          <ScrollView style={{ flexGrow: 0 }}>
            <View style={styles.leagueWrapper}>
              {renderLeagues(leagueSlice.leagues, selectedGW)}
            </View>
          </ScrollView>
        </View>
      ) : (
        <View style={{ marginBottom: 12 }}>
          <PremText order={3} centered>
            No leagues found
          </PremText>
          <PremText order={3} centered>
            Create or join a league
          </PremText>
        </View>
      )}

      <View style={styles.actionWrapper}>
        <PremButton
          onPress={() => {
            router.push('/leagues/CreateLeague');
          }}
        >
          Create
        </PremButton>
        <PremButton
          onPress={() => {
            dispatch(setJoinLeagueActive());
            router.push('/leagues/JoinLeague');
          }}
        >
          Join
        </PremButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  secondaryCard: {
    height: 60,
    width: 80,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.charcoal[2],
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
