import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors } from '../../styles/styles';
import PremText from './PremText';
import GameweekTimer from './GameweekTimer';

interface Props {
  selectedGW: number;
  setSelectedGameweek: (gw: number) => void;
}

const GameweekShifter = ({ selectedGW, setSelectedGameweek }: Props) => {
  return (
    <View>
      <View style={[styles.gameweekSection]}>
        <Pressable
          style={[styles.shifter]}
          onPress={() => {
            setSelectedGameweek(selectedGW - 1);
          }}
          disabled={selectedGW <= 1}
        >
          {({ pressed }) => (
            <AntDesign name="left" size={32} color={selectedGW > 1 && !pressed ? colors.gray[0] : colors.gray[3]} />
          )}
        </Pressable>
        <PremText order={1} centered>{`Gameweek ${selectedGW}`}</PremText>
        <Pressable
          style={[styles.shifter]}
          onPress={() => {
            setSelectedGameweek(selectedGW + 1);
          }}
          disabled={selectedGW >= 38}
        >
          {({ pressed }) => (
            <AntDesign name="right" size={32} color={selectedGW < 38 && !pressed ? colors.gray[0] : colors.gray[3]} />
          )}
        </Pressable>
      </View>

      <GameweekTimer selectedGW={selectedGW} />
    </View>
  );
};

const styles = StyleSheet.create({
  gameweekSection: {
    paddingVertical: 4,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  shifter: {
    padding: 8,
  },
});

export default GameweekShifter;
