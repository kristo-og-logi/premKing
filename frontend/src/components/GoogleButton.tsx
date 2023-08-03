import React from 'react';
import { Image } from 'react-native';
import PremButton from './basic/PremButton';

import googleImage from '../../assets/google.png';

const GoogleButton = () => {
  return (
    <PremButton fullWidth Icon={<Image source={googleImage} style={{ height: 28, width: 28 }} />}>
      Sign in
    </PremButton>
  );
};

export default GoogleButton;
