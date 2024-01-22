import * as SecureStore from 'expo-secure-store';
import { LoginResponse } from '../redux/reducers/authReducer';
import { jwtDecode } from './jwtDecode';

export const getTokenFromStorage = async (): Promise<LoginResponse> => {
  const credentials = await SecureStore.getItemAsync('CREDENTIALS');
  if (!credentials) throw new Error('credentials not found in storage');

  const userData: LoginResponse = JSON.parse(credentials);

  const tokenPayload = jwtDecode(userData.token);
  const currentTime = Date.now() / 1000;
  const expiryCounter = tokenPayload.exp - currentTime;

  if (expiryCounter < 0) throw new Error('token expired');

  return userData;
};

export const saveTokenInStorage = async (userData: LoginResponse) => {
  await SecureStore.setItemAsync('CREDENTIALS', JSON.stringify(userData));
};

export const removeTokenFromStorage = async () => {
  await SecureStore.deleteItemAsync('CREDENTIALS');
};
