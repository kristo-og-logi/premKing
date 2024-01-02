import { StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import PremText from '../../../components/basic/PremText';
import { globalStyles } from '../../../styles/styles';
import PremTextInput from '../../../components/basic/PremTextInput';
import PremButton from '../../../components/basic/PremButton';
import { router } from 'expo-router';
import { useAppDispatch } from '../../../redux/hooks';
import { add } from '../../../redux/reducers/leaguesReducer';
import { League, makeLeagueFromCode } from '../../../types/League';

const JoinLeague = () => {
  const [leagueCode, setLeagueCode] = useState<string>('');
  const dispatch = useAppDispatch();

  const joinLeague = () => {
    // POST leagues/join/:code
    const league: League = makeLeagueFromCode(leagueCode);
    dispatch(add(league));
  };

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
            joinLeague();
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
