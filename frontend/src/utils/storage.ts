import * as SecureStore from 'expo-secure-store';
import type { LoginResponse } from '../redux/reducers/authReducer';
import { jwtDecode } from './jwtDecode';

export const getTokenFromStorage = async (): Promise<LoginResponse> => {
  const credentials = await SecureStore.getItemAsync('CREDENTIALS');
  if (!credentials) throw new Error('credentials not found in storage');

  const userData: LoginResponse = JSON.parse(credentials);

  const tokenPayload = jwtDecode(userData.token);
  const currentTime = Date.now() / 1000;
  const expiryCounter = tokenPayload.exp - currentTime;

  // If the token is about to expire, just request a new one
  if (expiryCounter < 60 * 60) throw new Error('token expired');

  return userData;
};

export const saveTokenInStorage = async (userData: LoginResponse) => {
  await SecureStore.setItemAsync('CREDENTIALS', JSON.stringify(userData));
};

export const removeTokenFromStorage = async () => {
  await SecureStore.deleteItemAsync('CREDENTIALS');
};
