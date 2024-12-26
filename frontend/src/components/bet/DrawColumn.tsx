import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { colors } from '../../styles/styles';
import PremText from '../basic/PremText';

const DrawColumn = ({
  date,
  odds,
  isNormal,
  disabled = false,
  selected = false,
  selectable = true,
  onPress,
}: {
  date: string;
  odds: string;
  isNormal: boolean;
  disabled?: boolean;
  selected?: boolean;
  selectable?: boolean;
  onPress?: () => void;
}) => {
  return (
    <View style={styles.header}>
      <View style={{ height: 32 }}>
        <PremText order={4} centered={true} padding={12} color={!isNormal ? 'red' : 'white'}>
          {date}
        </PremText>
      </View>
      <TouchableOpacity
        style={{ ...styles.draw, ...(selectable ? (selected ? styles.win : styles.lose) : {}) }}
        disabled={disabled}
        onPress={onPress}
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

export default DrawColumn;

const styles = StyleSheet.create({
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
  win: {
    backgroundColor: colors.charcoal[3],
  },
  lose: {
    opacity: 0.5,
  },
});
