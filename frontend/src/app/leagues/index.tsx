import React from 'react';
import { Button, View, Text } from 'react-native';
import { Link, router } from 'expo-router';
import { styles } from '../../styles/styles';

export default function Page() {
  return (
    <View style={styles.container}>
      <Link href="/leagues/testId">Go to league</Link>
      <Text style={{ fontFamily: 'MusticaPro', color: '#fff', fontSize: 30 }}>
        The mustica Pro Font
      </Text>
      <Text style={{ color: '#fff', fontSize: 30 }}>RegularFont</Text>
      <Button
        title="go to updated league"
        onPress={() => {
          router.push('/leagues/testId2');
        }}
      />
    </View>
  );
}
