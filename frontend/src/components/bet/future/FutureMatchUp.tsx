import React from 'react';
import { View, StyleSheet } from 'react-native';
import Fixture from '../../../types/Fixture';
import TeamColumn, { Side } from '../TeamColumn';
import DrawColumn from '../DrawColumn';

interface Props {
  fixture: Fixture;
}

const FutureMatchUp = ({ fixture }: Props) => {
  return (
    <>
      <View style={styles.container}>
        <TeamColumn
          selectable={false}
          disabled={true}
          teamName={fixture.homeTeam.shortName || fixture.homeTeam.name}
          logo={{ uri: fixture.homeTeam.logo }}
          odds={fixture.homeOdds === 0 ? 'x.xx' : fixture.homeOdds.toFixed(2)}
          side={Side.LEFT}
        />
        <DrawColumn
          selectable={false}
          disabled={true}
          date={new Date(fixture.matchDate).toDateString()}
          odds={fixture.drawOdds === 0 ? 'x.xx' : fixture.drawOdds.toFixed(2)}
          isNormal={fixture.isNormal}
        />
        <TeamColumn
          selectable={false}
          disabled={true}
          teamName={fixture.awayTeam.shortName || fixture.awayTeam.name}
          logo={{ uri: fixture.awayTeam.logo }}
          odds={fixture.awayOdds === 0 ? 'x.xx' : fixture.awayOdds.toFixed(2)}
          side={Side.RIGHT}
        />
      </View>
    </>
  );
};

export default FutureMatchUp;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});
