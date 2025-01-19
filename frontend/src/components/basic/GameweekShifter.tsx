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
            if (selectedGW > 1) setSelectedGameweek(selectedGW - 1);
          }}
        >
          <AntDesign name="left" size={32} color={selectedGW > 1 ? colors.gray[0] : colors.gray[2]} />
        </Pressable>
        <PremText order={1} centered>{`Gameweek ${selectedGW}`}</PremText>
        <Pressable
          style={[styles.shifter]}
          onPress={() => {
            if (selectedGW < 38) setSelectedGameweek(selectedGW + 1);
          }}
        >
          <AntDesign name="right" size={32} color={selectedGW < 38 ? colors.gray[0] : colors.gray[2]} />
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
