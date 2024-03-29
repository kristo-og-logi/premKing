import React from 'react';
import { View, StyleSheet } from 'react-native';
import PremText from '../../basic/PremText';
import Fixture, { FixtureResult } from '../../../types/Fixture';
import { Bet } from '../../../types/Bet';
import TeamColumn, { Side } from '../TeamColumn';
import DrawColumn from '../DrawColumn';

interface Props {
  fixture: Fixture;
  bet?: Bet;
}

const PastMatchUp = ({ fixture, bet }: Props) => {
  return (
    <>
      <View style={styles.container}>
        <TeamColumn
          selected={
            // (fixture.finished && fixture.result == FixtureResult.HOME) ||
            bet?.result === FixtureResult.HOME
          }
          disabled={true}
          teamName={fixture.homeTeam.shortName || fixture.homeTeam.name}
          logo={{ uri: fixture.homeTeam.logo }}
          odds={'1.59'}
          side={Side.LEFT}
        />
        <DrawColumn
          selected={
            // (fixture.finished && fixture.result == FixtureResult.DRAW) ||
            bet?.result === FixtureResult.DRAW
          }
          disabled={true}
          date={new Date(fixture.matchDate).toDateString()}
          odds={'1.09'}
        />
        <TeamColumn
          selected={
            // (fixture.finished && fixture.result == FixtureResult.AWAY) ||
            bet?.result === FixtureResult.AWAY
          }
          disabled={true}
          teamName={fixture.awayTeam.shortName || fixture.awayTeam.name}
          logo={{ uri: fixture.awayTeam.logo }}
          odds={'2.49'}
          side={Side.RIGHT}
        />
      </View>

      <View>
        <PremText
          centered
        >{`${fixture.homeTeam.name} ${fixture.homeGoals} - ${fixture.awayGoals} ${fixture.awayTeam.name}`}</PremText>
      </View>
    </>
  );
};

export default PastMatchUp;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});
