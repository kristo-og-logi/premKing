import React from 'react';
import { View, StyleSheet } from 'react-native';
import Fixture, { FixtureResult } from '../../../types/Fixture';
import { Bet } from '../../../types/Bet';
import TeamColumn, { Side } from '../TeamColumn';
import DrawColumn from '../DrawColumn';
import { useAppSelector } from '../../../redux/hooks';

interface Props {
  fixture: Fixture;
  bet: Bet[];
  setBet: (bet: Bet[]) => void;
}

const CurrentMatchUpBet = ({ fixture, bet, setBet }: Props) => {
  const betSlice = useAppSelector((state) => state.bets);
  const fixtureExistsInBet = () => {
    return bet.some((b) => b.fixtureId === fixture.id);
  };

  const teamExistsInBet = (fixtureResult: FixtureResult) => {
    return bet.some((b) => b.fixtureId === fixture.id && b.result === fixtureResult);
  };

  const changeFixtureInBet = (fixtureResult: FixtureResult) => {
    setBet([
      ...bet.filter((b) => b.fixtureId !== fixture.id),
      {
        fixtureId: fixture.id,
        result: fixtureResult,
      },
    ]);
  };

  return (
    <>
      <View style={styles.container}>
        <TeamColumn
          selected={
            (fixture.finished && fixture.result == FixtureResult.HOME) ||
            bet.some((b) => b.fixtureId == fixture.id && b.result == FixtureResult.HOME)
          }
          teamName={fixture.homeTeam.shortName || fixture.homeTeam.name}
          logo={{ uri: fixture.homeTeam.logo }}
          odds={'1.59'}
          side={Side.LEFT}
          disabled={!betSlice.notFound}
          onPress={() => {
            teamExistsInBet(FixtureResult.HOME)
              ? setBet(bet.filter((b) => b.result !== FixtureResult.HOME))
              : fixtureExistsInBet()
                ? changeFixtureInBet(FixtureResult.HOME)
                : setBet([...bet, { fixtureId: fixture.id, result: FixtureResult.HOME }]);
          }}
        />
        <DrawColumn
          selected={
            (fixture.finished && fixture.result == FixtureResult.DRAW) ||
            bet.some((b) => b.fixtureId === fixture.id && b.result === FixtureResult.DRAW)
          }
          date={new Date(fixture.matchDate).toDateString()}
          odds={'1.09'}
          disabled={!betSlice.notFound}
          onPress={() => {
            teamExistsInBet(FixtureResult.DRAW)
              ? setBet(
                  bet.filter(
                    (b) => !(b.fixtureId === fixture.id && b.result === FixtureResult.DRAW)
                  )
                )
              : fixtureExistsInBet()
                ? changeFixtureInBet(FixtureResult.DRAW)
                : setBet([...bet, { fixtureId: fixture.id, result: FixtureResult.DRAW }]);
          }}
        />
        <TeamColumn
          selected={
            (fixture.finished && fixture.result == FixtureResult.AWAY) ||
            bet.some((b) => b.fixtureId === fixture.id && b.result === FixtureResult.AWAY)
          }
          teamName={fixture.awayTeam.shortName || fixture.awayTeam.name}
          logo={{ uri: fixture.awayTeam.logo }}
          disabled={!betSlice.notFound}
          odds={'2.49'}
          side={Side.RIGHT}
          onPress={() => {
            teamExistsInBet(FixtureResult.AWAY)
              ? setBet(bet.filter((b) => b.result !== FixtureResult.AWAY))
              : fixtureExistsInBet()
                ? changeFixtureInBet(FixtureResult.AWAY)
                : setBet([...bet, { fixtureId: fixture.id, result: FixtureResult.AWAY }]);
          }}
        />
      </View>
    </>
  );
};

export default CurrentMatchUpBet;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});
