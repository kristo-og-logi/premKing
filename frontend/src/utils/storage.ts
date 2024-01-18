import * as SecureStore from 'expo-secure-store';

export const getTokenFromStorage = async (): Promise<string> => {
  const token = await SecureStore.getItemAsync('TOKEN');
  if (!token) throw new Error('token not found in storage');
  return token;
};

export const saveTokenInStorage = async (token: string) => {
  await SecureStore.setItemAsync('TOKEN', token);
};
