import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import { colors } from '../../styles/styles';
import PremText from '../basic/PremText';
import Fixture from '../../types/Fixture';

enum Side {
  LEFT,
  RIGHT,
}

const TeamColumn = ({
  teamName,
  odds,
  logo,
  side,
}: {
  teamName: string;
  odds: string;
  logo: ImageSourcePropType;
  side: Side;
}) => {
  return (
    <View style={styles.header}>
      <PremText order={3} centered={true} padding={4}>
        {teamName}
      </PremText>
      <TouchableOpacity style={styles.team}>
        {side === Side.LEFT ? (
          <>
            <PremText order={3} centered={true}>
              {odds}
            </PremText>
            <Image source={logo} style={styles.image} />
          </>
        ) : (
          <>
            <Image source={logo} style={styles.image} />
            <PremText order={3} centered={true}>
              {odds}
            </PremText>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

const DrawMiddle = ({ date, odds }: { date: string; odds: string }) => {
  return (
    <View style={styles.header}>
      <PremText order={4} centered={true} padding={12}>
        {date}
      </PremText>
      <TouchableOpacity style={styles.draw}>
        <PremText order={3} centered={true}>
          Draw
        </PremText>
        <PremText order={3} centered={true}>
          {odds}
        </PremText>
      </TouchableOpacity>
    </View>
  );
};

interface Props {
  fixture: Fixture;
}

export const MatchUp = ({ fixture }: Props) => {
  return (
    <View style={styles.container}>
      <TeamColumn
        teamName={fixture.homeTeam.shortName || fixture.homeTeam.name}
        logo={{ uri: fixture.homeTeam.logo }}
        odds={'1.59'}
        side={Side.LEFT}
      />
      <DrawMiddle date={new Date(fixture.matchDate).toDateString()} odds={'1.09'} />
      <TeamColumn
        teamName={fixture.awayTeam.shortName || fixture.awayTeam.name}
        logo={{ uri: fixture.awayTeam.logo }}
        odds={'2.49'}
        side={Side.RIGHT}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  team: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: colors.charcoal[2],
    gap: 20,
    padding: 10,
  },
  draw: {
    flex: 1,
    alignSelf: 'center',
    padding: 5,
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
  },
  image: {
    height: 50,
    width: 50,
  },
});
