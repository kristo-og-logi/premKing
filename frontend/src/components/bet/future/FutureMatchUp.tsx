import React from 'react';
import { StyleSheet, View } from 'react-native';
import type Fixture from '../../../types/Fixture';
import { dateFormatter } from '../../../utils/constants';
import DrawColumn from '../DrawColumn';
import TeamColumn, { Side } from '../TeamColumn';

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
          teamName={fixture.homeTeam.shortName}
          logo={{ uri: fixture.homeTeam.logo }}
          odds={fixture.homeOdds === 0 ? 'x.xx' : fixture.homeOdds.toFixed(2)}
          side={Side.LEFT}
        />
        <DrawColumn
          selectable={false}
          disabled={true}
          date={dateFormatter.format(new Date(fixture.matchDate))}
          odds={fixture.drawOdds === 0 ? 'x.xx' : fixture.drawOdds.toFixed(2)}
          isNormal={fixture.isNormal}
        />
        <TeamColumn
          selectable={false}
          disabled={true}
          teamName={fixture.awayTeam.shortName}
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
