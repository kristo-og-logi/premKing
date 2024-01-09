import { View, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import PremText from '../../../components/basic/PremText';
import { router } from 'expo-router';
import PremButton from '../../../components/basic/PremButton';
import PremTextInput from '../../../components/basic/PremTextInput';
import { globalStyles } from '../../../styles/styles';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { createLeague } from '../../../redux/reducers/leaguesReducer';

const CreateLeague = () => {
  const [leagueName, setLeagueName] = useState<string>('');
  const dispatch = useAppDispatch();
  const authSlice = useAppSelector((state) => state.auth);

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
          onChangeText={(value) => setLeagueName(value)}
        />
        <PremButton
          onPress={() => {
            console.log(`POST /users/me/leagues body: {leagueName: ${leagueName}}`);
            dispatch(createLeague({ token: authSlice.token, leagueName: leagueName }));
            router.back();
          }}
        >
          Create league
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

export default CreateLeague;
