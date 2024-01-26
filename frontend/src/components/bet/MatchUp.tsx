import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import { colors } from '../../styles/styles';
import PremText from '../basic/PremText';
import Fixture from '../../types/Fixture';
import { useAppSelector } from '../../redux/hooks';

enum Side {
  LEFT,
  RIGHT,
}

const TeamColumn = ({
  teamName,
  odds,
  logo,
  side,
  disabled = false,
}: {
  teamName: string;
  odds: string;
  logo: ImageSourcePropType;
  side: Side;
  disabled: boolean;
}) => {
  return (
    <View style={styles.header}>
      <PremText order={3} centered={true} padding={4}>
        {teamName}
      </PremText>
      <TouchableOpacity style={styles.team} disabled={disabled}>
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

const DrawMiddle = ({
  date,
  odds,
  disabled = false,
}: {
  date: string;
  odds: string;
  disabled?: boolean;
}) => {
  return (
    <View style={styles.header}>
      <PremText order={4} centered={true} padding={12}>
        {date}
      </PremText>
      <TouchableOpacity style={styles.draw} disabled={disabled}>
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
  selectedGW: number;
}

export const MatchUp = ({ fixture, selectedGW }: Props) => {
  const gameweekSlice = useAppSelector((state) => state.gameweek);

  const selectedGWIsCurrent = selectedGW == gameweekSlice.gameweek;

  return (
    <View style={styles.container}>
      <TeamColumn
        disabled={!selectedGWIsCurrent}
        teamName={fixture.homeTeam.shortName || fixture.homeTeam.name}
        logo={{ uri: fixture.homeTeam.logo }}
        odds={'1.59'}
        side={Side.LEFT}
      />
      <DrawMiddle
        disabled={!selectedGWIsCurrent}
        date={new Date(fixture.matchDate).toDateString()}
        odds={'1.09'}
      />
      <TeamColumn
        disabled={!selectedGWIsCurrent}
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
