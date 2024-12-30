import { type PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type User from '../../types/User';
import { removeTokenFromStorage, saveTokenInStorage } from '../../utils/storage';
import type { RootState } from '../store';

import { BACKEND_URL } from '@env';
import { jwtDecode } from '../../utils/jwtDecode';

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

export const login = createAsyncThunk<LoginResponse, string>(
  'user/login',
  async (googleOAuthToken: string, { dispatch }) => {
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

      const tokenPayload = jwtDecode(data.token);

      const secLeft = tokenPayload.exp - new Date().getTime() / 1000;

      // HACK: when the token expires, we want to clear the user metadata,
      // causing the app to automatically redirect us to the login screen
      //
      // Ideally, we should not expire a session exactly when the token expires.
      // Rather, we should expire the user's token when they begin a new session close to their token's expiry.
      // That would mean that users would never be redirected to the login screen during a session,
      // e.g. just before submitting their fixture guesses
      //
      // Now, I'm not totally sure how to detect when a user is starting a new session,
      // but I'd say if they're making their first request in an hour and the token expires in 12 hours,
      // It would be safe to redirect them to the logout screen
      //
      // This is more work than I'd like to put in just now, and so this will have to do
      setTimeout(() => {
        removeTokenFromStorage();
        dispatch(clearUser());
      }, secLeft * 1000);

      return data;
    } catch (error) {
      console.log('ERROR logging in: ', error);
      throw error;
    }
  },
);

export const { clearUser, setUser, setUserDataFromStorage } = authSlice.actions;
export const selectUser = (state: RootState) => state.auth.user;

export default authSlice.reducer;
