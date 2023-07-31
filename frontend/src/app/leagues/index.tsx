import React from 'react';
import { Button, View } from 'react-native';
import { Link, router } from 'expo-router';
import { styles } from '../../styles/styles';

export default function Page() {
  return (
    <View style={styles.container}>
      <Link href="/leagues/testId">Go to league</Link>
      <Button
        title="go to updated league"
        onPress={() => {
          router.push('/leagues/testId2');
        }}
      />
    </View>
  );
}
