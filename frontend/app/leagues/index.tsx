import React from 'react';
import { Button, Text, View } from 'react-native';
import { Link, router } from 'expo-router';

export default function Page() {
  return (
    <View>
      <Text>My Leagues</Text>
      <Link href="/settings">Go to settings</Link>
      <Button
        title="go to my profile"
        onPress={() => {
          router.push('/profile');
        }}
      />
    </View>
  );
}
