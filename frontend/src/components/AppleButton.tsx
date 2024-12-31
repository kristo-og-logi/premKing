import * as AppleAuth from 'expo-apple-authentication';
import React from 'react';
import { Image } from 'react-native';
import PremButton from './basic/PremButton';

import appleImage from '../../assets/apple-white.png';
import { LoginType, login } from '../redux/reducers/authReducer';
import type { AppDispatch } from '../redux/store';

interface Props {
  dispatch: AppDispatch;
}

const appleSignin = async (dispatch: AppDispatch) => {
  try {
    const credential = await AppleAuth.signInAsync({
      requestedScopes: [AppleAuth.AppleAuthenticationScope.EMAIL, AppleAuth.AppleAuthenticationScope.FULL_NAME],
    });

    if (!credential.identityToken) {
      throw new Error('missing identityToken from Apple credential');
    }

    dispatch(
      login({
        loginType: LoginType.APPLE,
        appleRequest: {
          identityToken: credential.identityToken,
          fullName: {
            givenName: credential.fullName?.givenName,
            familyName: credential.fullName?.familyName,
          },
        },
      }),
    );
  } catch (e) {
    if (e.code === 'ERR_REQUEST_CANCELLED') {
      // handle cancelled
    } else {
      //handle other errors
    }
  }
};

const AppleButton = ({ dispatch }: Props) => {
  return (
    <PremButton
      onPress={() => appleSignin(dispatch)}
      fullWidth
      Icon={<Image source={appleImage} style={{ height: 32, width: 32 }} />}
    >
      Sign in
    </PremButton>
  );
};

export default AppleButton;
