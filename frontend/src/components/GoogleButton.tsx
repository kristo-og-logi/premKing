import React from 'react';
import { Image } from 'react-native';
import PremButton from './basic/PremButton';

import googleImage from '../../assets/google.png';

interface Props {
  onPress: () => void;
}

const GoogleButton = ({ onPress }: Props) => {
  return (
    <PremButton onPress={onPress} fullWidth Icon={<Image source={googleImage} style={{ height: 28, width: 28 }} />}>
      Sign in
    </PremButton>
  );
};

export default GoogleButton;
