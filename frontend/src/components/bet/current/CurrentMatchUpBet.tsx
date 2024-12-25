import React from 'react';
import { View, StyleSheet } from 'react-native';
import type Fixture from '../../../types/Fixture';
import { FixtureResult } from '../../../types/Fixture';
import type { Bet } from '../../../types/Bet';
import TeamColumn, { Side } from '../TeamColumn';
import DrawColumn from '../DrawColumn';
import { useAppSelector } from '../../../redux/hooks';
import { dateFormatter } from '../../../utils/constants';

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
        odd: 0,
        won: false,
      },
    ]);
  };

  const isSelected = (result: FixtureResult) => {
    return bet.some((b) => b.fixtureId == fixture.id && b.result == result);
  };

  const handlePress = (result: FixtureResult) => {
    teamExistsInBet(result)
      ? setBet(bet.filter((b) => !(b.fixtureId === fixture.id && b.result === result)))
      : fixtureExistsInBet()
        ? changeFixtureInBet(result)
        : setBet([...bet, { fixtureId: fixture.id, result: result, odd: 0, won: false }]);
  };

  return (
    <>
      <View style={styles.container}>
        <TeamColumn
          selected={isSelected(FixtureResult.HOME)}
          teamName={fixture.homeTeam.shortName || fixture.homeTeam.name}
          logo={{ uri: fixture.homeTeam.logo }}
          odds={fixture.homeOdds === 0 ? 'x.xx' : fixture.homeOdds.toFixed(2)}
          side={Side.LEFT}
          disabled={betSlice.bets[betSlice.selectedGameweek - 1].bets.length > 0}
          onPress={() => handlePress(FixtureResult.HOME)}
        />
        <DrawColumn
          selected={isSelected(FixtureResult.DRAW)}
          date={dateFormatter.format(new Date(fixture.matchDate))}
          odds={fixture.drawOdds === 0 ? 'x.xx' : fixture.drawOdds.toFixed(2)}
          disabled={betSlice.bets[betSlice.selectedGameweek - 1].bets.length > 0}
          isNormal={fixture.isNormal}
          onPress={() => handlePress(FixtureResult.DRAW)}
        />
        <TeamColumn
          selected={isSelected(FixtureResult.AWAY)}
          teamName={fixture.awayTeam.shortName || fixture.awayTeam.name}
          logo={{ uri: fixture.awayTeam.logo }}
          disabled={betSlice.bets[betSlice.selectedGameweek - 1].bets.length > 0}
          odds={fixture.awayOdds === 0 ? 'x.xx' : fixture.awayOdds.toFixed(2)}
          side={Side.RIGHT}
          onPress={() => handlePress(FixtureResult.AWAY)}
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
