import { StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { colors, globalStyles } from '../../styles/styles';
import PremText from './PremText';

interface Props {
  fullWidth?: boolean;
  Icon?: JSX.Element;
  children: string;
}

const PremButton = ({ fullWidth = false, Icon, children }: Props) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        fullWidth ? styles.fullWidth : styles.normalWidth,
        globalStyles.shadow,
      ]}
    >
      <PremText>{children}</PremText>
      {Icon}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.charcoal[2],
    color: colors.gray[0],
    height: 48,
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  fullWidth: {
    width: 'auto',
  },
  normalWidth: {
    width: 120,
  },
});

export default PremButton;
