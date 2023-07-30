import React from 'react';
import { Button, View } from 'react-native';
import { Link, router } from 'expo-router';

export default function Page() {
  return (
    <View>
      <Link href="/leagues/testId">Go to league</Link>
      <Button
        title="go to league 2"
        onPress={() => {
          router.push('/leagues/testId2');
        }}
      />
    </View>
  );
}
