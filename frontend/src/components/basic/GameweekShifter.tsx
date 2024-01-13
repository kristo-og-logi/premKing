import { View, StyleSheet } from 'react-native';
import React from 'react';
import { AntDesign } from '@expo/vector-icons';
import { colors } from '../../styles/styles';
import PremText from './PremText';
import { useAppSelector } from '../../redux/hooks';

interface Props {
  selectedGW: number;
  setSelectedGW: (selectedGW: number) => void;
}

const GameweekShifter = ({ setSelectedGW, selectedGW }: Props) => {
  const gameweekSlice = useAppSelector((state) => state.gameweek);

  return (
    <View style={styles.gameweekSection}>
      <AntDesign
        name="left"
        size={24}
        color={selectedGW > 1 ? colors.gray[0] : colors.gray[2]}
        onPress={() => {
          if (selectedGW > 1) setSelectedGW(selectedGW - 1);
        }}
      />
      <PremText order={1} centered>{`Gameweek ${selectedGW}`}</PremText>
      <AntDesign
        name="right"
        size={24}
        color={selectedGW < 38 ? colors.gray[0] : colors.gray[2]}
        onPress={() => {
          if (selectedGW < 38) setSelectedGW(selectedGW + 1);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  gameweekSection: {
    paddingVertical: 12,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

export default GameweekShifter;
