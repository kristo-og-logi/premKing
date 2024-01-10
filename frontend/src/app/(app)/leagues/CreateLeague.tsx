import { View, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import PremText from '../../../components/basic/PremText';
import { router } from 'expo-router';
import PremButton from '../../../components/basic/PremButton';
import PremTextInput from '../../../components/basic/PremTextInput';
import { colors, globalStyles } from '../../../styles/styles';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { createLeague } from '../../../redux/reducers/leaguesReducer';
import { ERROR_TIMEOUT } from '../../../utils/constants';

const MAX_LEN = 30;

const CreateLeague = () => {
  const dispatch = useAppDispatch();
  const authSlice = useAppSelector((state) => state.auth);

  const [leagueName, setLeagueName] = useState<string>('');
  const [inputError, setInputError] = useState<boolean>(false);

  useEffect(() => {
    if (inputError)
      setTimeout(() => {
        setInputError(false);
      }, ERROR_TIMEOUT);
  }, [inputError]);

  return (
    <View style={globalStyles.container}>
      <View style={styles.header}>
        <PremText order={2}>Create League</PremText>
      </View>
      <PremText>League Name</PremText>
      <View style={styles.inputWrapper}>
        <PremTextInput
          placeholder="League name here"
          value={leagueName}
          onChangeText={(value) => {
            value.length >= MAX_LEN ? setInputError(true) : setLeagueName(value);
          }}
        />
        <PremButton
          disabled={leagueName == ''}
          onPress={() => {
            dispatch(createLeague({ token: authSlice.token, leagueName: leagueName }));
            router.back();
          }}
        >
          Create league
        </PremButton>
      </View>
      <PremText
        order={4}
        centered
        color={inputError ? colors.red : undefined}
      >{`League name must be under ${MAX_LEN} characters`}</PremText>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  inputWrapper: {
    display: 'flex',
    flexDirection: 'row',
    marginVertical: 8,
    gap: 8,
  },
});

export default CreateLeague;
