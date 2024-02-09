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
    return bet.some((b) => b.fixture === fixture.id);
  };

  const teamExistsInBet = (teamName: string) => {
    return bet.some((b) => b.fixture === fixture.id && b.team === teamName);
  };

  const changeFixtureInBet = (newTeam: string) => {
    setBet([
      ...bet.filter((b) => b.fixture !== fixture.id),
      { fixture: fixture.id, team: newTeam },
    ]);
  };

  return (
    <>
      <View style={styles.container}>
        <TeamColumn
          selected={
            (fixture.finished && fixture.result == FixtureResult.HOME) ||
            bet.some((b) => b.fixture == fixture.id && b.team == fixture.homeTeam.name)
          }
          teamName={fixture.homeTeam.shortName || fixture.homeTeam.name}
          logo={{ uri: fixture.homeTeam.logo }}
          odds={'1.59'}
          side={Side.LEFT}
          onPress={() => {
            const teamName = fixture.homeTeam.name;
            selectedGWIsCurrent && teamExistsInBet(teamName)
              ? setBet(bet.filter((b) => b.team !== teamName))
              : fixtureExistsInBet()
                ? changeFixtureInBet(teamName)
                : setBet([...bet, { fixture: fixture.id, team: teamName }]);
          }}
        />
        <DrawColumn
          selected={
            (fixture.finished && fixture.result == FixtureResult.DRAW) ||
            bet.some((b) => b.fixture === fixture.id && b.team === 'DRAW')
          }
          date={new Date(fixture.matchDate).toDateString()}
          odds={'1.09'}
          onPress={() => {
            selectedGWIsCurrent && teamExistsInBet('DRAW')
              ? setBet(bet.filter((b) => !(b.fixture === fixture.id && b.team === 'DRAW')))
              : fixtureExistsInBet()
                ? changeFixtureInBet('DRAW')
                : setBet([...bet, { fixture: fixture.id, team: 'DRAW' }]);
          }}
        />
        <TeamColumn
          selected={
            (fixture.finished && fixture.result == FixtureResult.AWAY) ||
            bet.some((b) => b.fixture === fixture.id && b.team === fixture.awayTeam.name)
          }
          teamName={fixture.awayTeam.shortName || fixture.awayTeam.name}
          logo={{ uri: fixture.awayTeam.logo }}
          odds={'2.49'}
          side={Side.RIGHT}
          onPress={() => {
            const teamName = fixture.awayTeam.name;
            selectedGWIsCurrent && teamExistsInBet(teamName)
              ? setBet(bet.filter((b) => b.team !== teamName))
              : fixtureExistsInBet()
                ? changeFixtureInBet(teamName)
                : setBet([...bet, { fixture: fixture.id, team: teamName }]);
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
