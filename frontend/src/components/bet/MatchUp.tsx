import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import { colors } from '../../styles/styles';
import liverpoolImg from '../../../assets/team-logos/liverpool.png';
import chelseaImg from '../../../assets/team-logos/chelsea.png';
import PremText from '../basic/PremText';

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
      <PremText order={2} centered={true} padding={4}>
        {teamName}
      </PremText>
      <TouchableOpacity style={styles.team}>
        {side === Side.LEFT ? (
          <>
            <PremText order={2} centered={true}>
              {odds}
            </PremText>
            <Image source={logo} style={styles.image} />
          </>
        ) : (
          <>
            <Image source={logo} style={styles.image} />
            <PremText order={2} centered={true}>
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
        <PremText order={2} centered={true}>
          Draw
        </PremText>
        <PremText order={2} centered={true}>
          {odds}
        </PremText>
      </TouchableOpacity>
    </View>
  );
};

export const MatchUp = () => {
  return (
    <View style={styles.container}>
      <TeamColumn teamName={'Liverpool'} logo={liverpoolImg} odds={'1.59'} side={Side.LEFT} />
      <DrawMiddle date={'12. August 13:00'} odds={'1.09'} />
      <TeamColumn teamName={'Chelsea'} logo={chelseaImg} odds={'2.49'} side={Side.RIGHT} />
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
