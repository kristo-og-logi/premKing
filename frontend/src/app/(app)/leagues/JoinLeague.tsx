import { StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import PremText from '../../../components/basic/PremText';
import { globalStyles } from '../../../styles/styles';
import PremTextInput from '../../../components/basic/PremTextInput';
import PremButton from '../../../components/basic/PremButton';
import { router } from 'expo-router';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { joinLeague } from '../../../redux/reducers/leaguesReducer';

const JoinLeague = () => {
  const [leagueCode, setLeagueCode] = useState<string>('');
  const dispatch = useAppDispatch();

  const token = useAppSelector((state) => state.auth.token);

  return (
    <View style={globalStyles.container}>
      <View style={styles.header}>
        <PremText order={2}>Join League</PremText>
      </View>
      <PremText>League Code</PremText>
      <PremText centered>Try asdf or ABCD</PremText>
      <View style={styles.inputWrapper}>
        <PremTextInput
          placeholder="League code here"
          value={leagueCode}
          onChangeText={(value) => setLeagueCode(value)}
        />
        <PremButton
          onPress={() => {
            dispatch(joinLeague({ token: token, leagueId: leagueCode }));
            console.log(`POST /users/me/leagues/join body: {leagueId: ${leagueCode}}`);
            router.back();
          }}
        >
          Join league
        </PremButton>
      </View>
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
