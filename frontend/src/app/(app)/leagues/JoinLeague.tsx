import { StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import PremText from '../../../components/basic/PremText';
import { colors, globalStyles } from '../../../styles/styles';
import PremTextInput from '../../../components/basic/PremTextInput';
import PremButton from '../../../components/basic/PremButton';
import { router } from 'expo-router';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { joinLeague } from '../../../redux/reducers/leaguesReducer';

const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const ID_LEN = 6;

const JoinLeague = () => {
  const [leagueCode, setLeagueCode] = useState<string>('');
  const dispatch = useAppDispatch();

  const token = useAppSelector((state) => state.auth.token);

  const [inputError, setInputError] = useState<boolean>(false);

  useEffect(() => {
    if (inputError) setTimeout(() => setInputError(false), 2000);
  }, [inputError]);

  const isValidCode = (): boolean => {
    if (leagueCode.length !== ID_LEN) return false;
    for (const char of leagueCode) if (!CHARSET.includes(char)) return false;
    return true;
  };

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
          disabled={!isValidCode()}
          onPress={() => {
            dispatch(joinLeague({ token: token, leagueId: leagueCode }));
            console.log(`POST /users/me/leagues/join body: {leagueId: ${leagueCode}}`);
            router.back();
          }}
        >
          Join league
        </PremButton>
      </View>
      <PremText centered order={4} color={inputError ? colors.red : undefined}>
        Code must be a mix of 6 letters or numbers
      </PremText>
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
