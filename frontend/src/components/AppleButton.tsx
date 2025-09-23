import * as AppleAuth from 'expo-apple-authentication';
import { Image } from 'react-native';
import PremButton from './basic/PremButton';

import appleImage from '../../assets/apple-white.png';
import { LoginType, login } from '../redux/reducers/authReducer';
import type { AppDispatch } from '../redux/store';

interface Props {
  dispatch: AppDispatch;
}

/* expo's AppleAuth errors seem to be `{code: string}` objects,
 * but they're not typehinted as such.
 * Seems like we must do this for them
 */
const isAppleAuthError = (e: unknown): e is { code: string } => {
  return typeof e === 'object' && e !== null && 'code' in e && typeof e.code === 'string';
};

const appleSignin = async (dispatch: AppDispatch) => {
  let credential: AppleAuth.AppleAuthenticationCredential;
  try {
    credential = await AppleAuth.signInAsync({
      requestedScopes: [AppleAuth.AppleAuthenticationScope.EMAIL, AppleAuth.AppleAuthenticationScope.FULL_NAME],
    });
  } catch (e) {
    if (!isAppleAuthError(e) || e.code !== 'ERR_REQUEST_CANCELED') {
      console.error(`unknown apple signin error: ${JSON.stringify(e)}`);
    }
    return;
  }

  // the identity token cannot be missing
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
        user: credential.user,
      },
    }),
  );
};

const AppleButton = ({ dispatch }: Props) => {
  return (
    <PremButton
      onPress={() => appleSignin(dispatch)}
      fullWidth
      Icon={<Image source={appleImage} style={{ height: 32, width: 32 }} />}
    >
      Sign in with Apple
    </PremButton>
  );
};

export default AppleButton;
