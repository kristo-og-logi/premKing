import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const JoinLeague = ({ route, navigation }) => {
  const { leagues, setLeagues } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.whiteText}>Join League</Text>
      <View style={styles.button}>
        <Button
          title="Join league"
          onPress={() => {
            const newLeagues = leagues.concat(['joined league']);
            setLeagues(newLeagues);
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    backgroundColor: '#072936',
    alignItems: 'center',
  },
  whiteText: {
    color: 'white',
  },
  buttonBackground: {
    backgroundColor: '#0A475C',
  },
  buttonWrapper: {
    flex: 0,
    gap: 20,
  },
  button: {
    backgroundColor: '#0A475C',
    color: 'white',
  },
  actionWrapper: {
    flex: 0,
    gap: 8,
    flexDirection: 'row',
  },
});

export default JoinLeague;
