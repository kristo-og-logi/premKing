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
          odds={'1.59'}
          side={Side.LEFT}
        />
        <DrawColumn
          selectable={false}
          disabled={true}
          date={new Date(fixture.matchDate).toDateString()}
          odds={'1.09'}
        />
        <TeamColumn
          selectable={false}
          disabled={true}
          teamName={fixture.awayTeam.shortName || fixture.awayTeam.name}
          logo={{ uri: fixture.awayTeam.logo }}
          odds={'2.49'}
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
