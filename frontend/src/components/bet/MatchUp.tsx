import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
  ViewStyle,
} from 'react-native';
import { colors } from '../../styles/styles';
import PremText from '../basic/PremText';
import Fixture, { FixtureResult } from '../../types/Fixture';
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
  selected = false,
  extraStyles = {},
  finished,
}: {
  teamName: string;
  odds: string;
  logo: ImageSourcePropType;
  side: Side;
  disabled: boolean;
  selected: boolean;
  extraStyles?: ViewStyle;
  finished: boolean;
}) => {
  return (
    <View style={{ ...styles.header }}>
      <View style={{ height: 32 }}>
        <PremText order={3} centered={true} padding={4}>
          {teamName}
        </PremText>
      </View>
      <TouchableOpacity
        style={{
          ...styles.team,
          ...extraStyles,
          ...(finished && (selected ? styles.win : styles.lose)),
        }}
        disabled={disabled}
      >
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
  selected = false,
  finished,
}: {
  date: string;
  odds: string;
  disabled?: boolean;
  selected?: boolean;
  finished: boolean;
}) => {
  return (
    <View style={styles.header}>
      <View style={{ height: 32 }}>
        <PremText order={4} centered={true} padding={12}>
          {date}
        </PremText>
      </View>
      <TouchableOpacity
        style={{ ...styles.draw, ...(finished && (selected ? styles.win : styles.lose)) }}
        disabled={disabled}
      >
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
    <>
      <View style={styles.container}>
        <TeamColumn
          finished={fixture.finished}
          extraStyles={styles.homeTeamBorder}
          selected={fixture.result == FixtureResult.HOME}
          disabled={!selectedGWIsCurrent}
          teamName={fixture.homeTeam.shortName || fixture.homeTeam.name}
          logo={{ uri: fixture.homeTeam.logo }}
          odds={'1.59'}
          side={Side.LEFT}
        />
        <DrawMiddle
          finished={fixture.finished}
          selected={fixture.result == FixtureResult.DRAW}
          disabled={!selectedGWIsCurrent}
          date={new Date(fixture.matchDate).toDateString()}
          odds={'1.09'}
        />
        <TeamColumn
          finished={fixture.finished}
          extraStyles={styles.awayTeamBorder}
          selected={fixture.result == FixtureResult.AWAY}
          disabled={!selectedGWIsCurrent}
          teamName={fixture.awayTeam.shortName || fixture.awayTeam.name}
          logo={{ uri: fixture.awayTeam.logo }}
          odds={'2.49'}
          side={Side.RIGHT}
        />
      </View>
      {fixture.finished && (
        <View>
          <PremText
            centered
          >{`${fixture.homeTeam.name} ${fixture.homeGoals} - ${fixture.awayGoals} ${fixture.awayTeam.name}`}</PremText>
        </View>
      )}
    </>
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
    alignItems: 'center',
    justifyContent: 'center',
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

  win: {
    backgroundColor: colors.charcoal[3],
  },
  lose: {
    opacity: 0.5,
  },
  homeTeamBorder: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },

  awayTeamBorder: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
});
