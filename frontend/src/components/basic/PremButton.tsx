import { Role, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { colors, globalStyles } from '../../styles/styles';
import PremText from './PremText';
import { Href } from 'expo-router/build/link/href';

interface Props {
  fullWidth?: boolean;
  Icon?: JSX.Element;
  onPress: () => void;
  children: string;
  href?: Href;
  role?: Role;
  ref?: React.RefObject<TouchableOpacity> | undefined;
}

const PremButton = ({ fullWidth = false, Icon, onPress, children, role, ref }: Props) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        fullWidth ? styles.fullWidth : styles.normalWidth,
        globalStyles.shadow,
      ]}
      onPress={onPress}
      role={role}
      ref={ref}
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
