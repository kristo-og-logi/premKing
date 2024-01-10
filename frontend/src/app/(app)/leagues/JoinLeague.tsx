import { StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import PremText from '../../../components/basic/PremText';
import { colors, globalStyles } from '../../../styles/styles';
import PremTextInput from '../../../components/basic/PremTextInput';
import PremButton from '../../../components/basic/PremButton';
import { router } from 'expo-router';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { joinLeague, removeJoinLeagueError } from '../../../redux/reducers/leaguesReducer';

const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const ID_LEN = 6;
const ERROR_TIMEOUT = 3000;

const isValidCode = (leagueCode: string): boolean => {
  if (leagueCode.length !== ID_LEN) return false;
  for (const char of leagueCode) if (!CHARSET.includes(char)) return false;
  return true;
};

const JoinLeague = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const leagueSlice = useAppSelector((state) => state.leagues);

  const [leagueCode, setLeagueCode] = useState<string>('');
  const [inputError, setInputError] = useState<boolean>(false);

  useEffect(() => {
    if (inputError) setTimeout(() => setInputError(false), ERROR_TIMEOUT);
  }, [inputError]);

  useEffect(() => {
    if (!leagueSlice.joinActive) router.back();
  }, [leagueSlice.joinActive]);

  useEffect(() => {
    setLeagueCode('');
    setTimeout(() => dispatch(removeJoinLeagueError()), ERROR_TIMEOUT);
  }, [leagueSlice.joinHasError]);

  return (
    <View style={globalStyles.container}>
      <View style={styles.header}>
        <PremText order={2}>Join League</PremText>
      </View>
      <PremText>League Code</PremText>

      <View style={styles.inputWrapper}>
        <PremTextInput
          placeholder="XYC123"
          value={leagueCode}
          onChangeText={(value) =>
            value.length <= 6 ? setLeagueCode(value.toUpperCase()) : setInputError(true)
          }
        />
        <PremButton
          disabled={!isValidCode(leagueCode) || leagueSlice.joinIsLoading}
          onPress={() => dispatch(joinLeague({ token: token, leagueId: leagueCode }))}
        >
          Join league
        </PremButton>
      </View>
      <PremText centered order={4} color={inputError ? colors.red : undefined}>
        Code must be a mix of 6 letters or numbers
      </PremText>
      {leagueSlice.joinIsLoading ? (
        <PremText>loading...</PremText>
      ) : (
        leagueSlice.joinHasError && (
          <View>
            <PremText color={colors.red}>Error joining league</PremText>
            <PremText order={4} color={colors.red}>
              {leagueSlice.joinErrorMessage}
            </PremText>
          </View>
        )
      )}
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

export default JoinLeague;
