import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const CreateLeague = ({ route, navigation }) => {
  const { leagues, setLeagues } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.button}>
        <Button
          title="Create league"
          color={'white'}
          onPress={() => {
            const newLeagues = leagues.concat(['created league']);
            setLeagues(newLeagues);
            navigation.goBack();
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

export default CreateLeague;
