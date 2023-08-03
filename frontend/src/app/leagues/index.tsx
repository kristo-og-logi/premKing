import React from 'react';
import { Button, View } from 'react-native';
import { Link, router } from 'expo-router';

import { globalStyles } from '../../styles/styles';
import PremText from '../../components/basic/PremText';
import PremButton from '../../components/basic/PremButton';
import GoogleButton from '../../components/GoogleButton';

export default function Page() {
  return (
    <View style={globalStyles.container}>
      <Link href="/leagues/testId">Go to league</Link>
      <PremText order={1}>Title</PremText>
      <PremText order={2}>Subtitle</PremText>
      <PremText order={3}>Normal</PremText>
      <PremText order={4}>Small</PremText>
      <PremButton onPress={() => console.log('hello')}>PremButton</PremButton>

      <PremButton onPress={() => console.log('fullwidth')} fullWidth>
        fullWidth
      </PremButton>
      <GoogleButton />
      <Button
        title="go to updated league"
        onPress={() => {
          router.push('/leagues/testId2');
        }}
      />
    </View>
  );
}
