import { StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import PremText from '../../components/basic/PremText';
import { globalStyles } from '../../styles/styles';
import PremTextInput from '../../components/basic/PremTextInput';
import PremButton from '../../components/basic/PremButton';
import { router } from 'expo-router';

const JoinLeague = () => {
  const [leagueName, setLeagueName] = useState<string>('');

  return (
    <View style={globalStyles.container}>
      <View style={styles.header}>
        <PremText order={2}>Join League</PremText>
      </View>
      <PremText>League Code</PremText>
      <View style={styles.inputWrapper}>
        <PremTextInput
          placeholder="League code here"
          value={leagueName}
          onChangeText={(value) => setLeagueName(value)}
        />
        <PremButton
          onPress={() => {
            console.log(`POST /users/me/leagues body: {leagueId: ${leagueName}}`);
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
