import React from 'react';
import { Button, Text, View } from 'react-native';
import { router } from 'expo-router';

const Stats = () => {
  return (
    <View>
      <Text>My Stats</Text>
      <Button
        title="go to my profile"
        onPress={() => {
          router.push('/profile');
        }}
      />
    </View>
  );
};

export default Stats;
