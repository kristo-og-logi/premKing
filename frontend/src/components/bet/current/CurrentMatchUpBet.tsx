import React from 'react';
import { View, StyleSheet } from 'react-native';
import Fixture, { FixtureResult } from '../../../types/Fixture';
import { Bet } from '../../../types/Bet';
import TeamColumn, { Side } from '../TeamColumn';
import DrawColumn from '../DrawColumn';

interface Props {
  fixture: Fixture;
  bet: Bet[];
  setBet: (bet: Bet[]) => void;
}

const CurrentMatchUpBet = ({ fixture, bet, setBet }: Props) => {
  const selectedGWIsCurrent = true;

  const fixtureExistsInBet = () => {
    return bet.some((b) => b.fixtureId === fixture.id);
  };

  const teamExistsInBet = (fixtureResult: FixtureResult) => {
    return bet.some((b) => b.fixtureId === fixture.id && b.bet === fixtureResult);
  };

  const changeFixtureInBet = (fixtureResult: FixtureResult) => {
    setBet([
      ...bet.filter((b) => b.fixtureId !== fixture.id),
      {
        fixtureId: fixture.id,
        bet: fixtureResult,
      },
    ]);
  };

  return (
    <>
      <View style={styles.container}>
        <TeamColumn
          selected={
            (fixture.finished && fixture.result == FixtureResult.HOME) ||
            bet.some((b) => b.fixtureId == fixture.id && b.bet == FixtureResult.HOME)
          }
          teamName={fixture.homeTeam.shortName || fixture.homeTeam.name}
          logo={{ uri: fixture.homeTeam.logo }}
          odds={'1.59'}
          side={Side.LEFT}
          onPress={() => {
            selectedGWIsCurrent && teamExistsInBet(FixtureResult.HOME)
              ? setBet(bet.filter((b) => b.bet !== FixtureResult.HOME))
              : fixtureExistsInBet()
                ? changeFixtureInBet(FixtureResult.HOME)
                : setBet([...bet, { fixtureId: fixture.id, bet: FixtureResult.HOME }]);
          }}
        />
        <DrawColumn
          selected={
            (fixture.finished && fixture.result == FixtureResult.DRAW) ||
            bet.some((b) => b.fixtureId === fixture.id && b.bet === FixtureResult.DRAW)
          }
          date={new Date(fixture.matchDate).toDateString()}
          odds={'1.09'}
          onPress={() => {
            selectedGWIsCurrent && teamExistsInBet(FixtureResult.DRAW)
              ? setBet(
                  bet.filter((b) => !(b.fixtureId === fixture.id && b.bet === FixtureResult.DRAW))
                )
              : fixtureExistsInBet()
                ? changeFixtureInBet(FixtureResult.DRAW)
                : setBet([...bet, { fixtureId: fixture.id, bet: FixtureResult.DRAW }]);
          }}
        />
        <TeamColumn
          selected={
            (fixture.finished && fixture.result == FixtureResult.AWAY) ||
            bet.some((b) => b.fixtureId === fixture.id && b.bet === FixtureResult.AWAY)
          }
          teamName={fixture.awayTeam.shortName || fixture.awayTeam.name}
          logo={{ uri: fixture.awayTeam.logo }}
          odds={'2.49'}
          side={Side.RIGHT}
          onPress={() => {
            selectedGWIsCurrent && teamExistsInBet(FixtureResult.AWAY)
              ? setBet(bet.filter((b) => b.bet !== FixtureResult.AWAY))
              : fixtureExistsInBet()
                ? changeFixtureInBet(FixtureResult.AWAY)
                : setBet([...bet, { fixtureId: fixture.id, bet: FixtureResult.AWAY }]);
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
