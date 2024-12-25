import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import User from '../../types/User';
import { RootState } from '../store';
import { saveTokenInStorage } from '../../utils/storage';

import { BACKEND_URL } from '@env';

export interface AuthState {
  user?: User;
  token: string;
  isLoading: boolean;
  hasError: boolean;
}

const initialState: AuthState = {
  user: undefined,
  token: '',
  isLoading: false,
  hasError: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    clearUser: (state) => {
      state.user = undefined;
      state.token = '';
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setUserDataFromStorage: (state, action: PayloadAction<LoginResponse>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isLoading = false;
      })
      .addCase(login.rejected, (state) => {
        state.hasError = true;
        state.isLoading = false;
      });
  },
});

export interface LoginResponse {
  user: User;
  token: string;
}

export const login = createAsyncThunk<LoginResponse, string>('user/login', async (googleOAuthToken: string) => {
  const url = `${BACKEND_URL}/api/v1/auth/login`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        googleToken: googleOAuthToken,
      }),
    });

    if (!response.ok) {
      const message: { error: string } = await response.json();
      throw new Error(message.error);
    }

    const data: LoginResponse = await response.json();
    console.log('token: ', data.token);
    await saveTokenInStorage(data);

    return data;
  } catch (error) {
    console.log('ERROR logging in: ', error);
    throw error;
  }
});

export const { clearUser, setUser, setUserDataFromStorage } = authSlice.actions;
export const selectUser = (state: RootState) => state.auth.user;

export default authSlice.reducer;
