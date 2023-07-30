import React from 'react';
import { Button, Text, View } from 'react-native';
import { router } from 'expo-router';

const Bet = () => {
  return (
    <View>
      <Text>My Bet</Text>
      <Text>Gameweek 1</Text>
      <Button
        title="go to my profile"
        onPress={() => {
          router.push('/profile');
        }}
      />
    </View>
  );
};

export default Bet;
