import React from 'react';
import { type ImageSourcePropType, View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import PremText from '../basic/PremText';
import { colors } from '../../styles/styles';

export enum Side {
  LEFT = 0,
  RIGHT = 1,
}

const TeamColumn = ({
  teamName,
  odds,
  logo,
  side,
  disabled = false,
  selected = false,
  selectable = true,
  onPress,
}: {
  teamName: string;
  odds: string;
  logo: ImageSourcePropType;
  side: Side;
  disabled?: boolean;
  selected?: boolean;
  selectable?: boolean;
  onPress?: () => void;
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
          ...(side == Side.LEFT ? styles.homeTeamBorder : styles.awayTeamBorder),
          ...(selectable ? (selected ? styles.win : styles.lose) : {}),
        }}
        disabled={disabled}
        onPress={onPress}
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

export default TeamColumn;

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
