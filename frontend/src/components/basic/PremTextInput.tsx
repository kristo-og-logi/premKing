import { StyleSheet, TextInput } from 'react-native';
import React from 'react';
import { colors, globalStyles } from '../../styles/styles';

interface Props {
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
}

const PremTextInput = (props: Props) => {
  return (
    <TextInput
      style={[styles.textInput, globalStyles.premFont]}
      placeholder={props.placeholder}
      value={props.value}
      onChangeText={props.onChangeText}
    />
  );
};

const styles = StyleSheet.create({
  textInput: {
    borderWidth: 2,
    borderColor: colors.charcoal[3],
    backgroundColor: colors.charcoal[2],
    borderRadius: 4,
    color: colors.gray[0],
    fontSize: 18,
    height: 48,
    paddingHorizontal: 4,
    flexGrow: 1,
  },
});

export default PremTextInput;
