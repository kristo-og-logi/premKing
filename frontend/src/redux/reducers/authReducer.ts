import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import User from '../../types/User';
import { RootState } from '../store';

export interface AuthState {
  user?: User;
  googleToken?: string;
  token?: string;
  isLoading: boolean;
  hasError: boolean;
}

const initialState: AuthState = {
  user: undefined,
  googleToken: undefined,
  token: undefined,
  isLoading: false,
  hasError: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    clearUser: (state) => {
      state.user = undefined;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state) => {
        state.isLoading = false;
        state.hasError = true;
      });
  },
});

export interface LoginResponse {
  user: User;
  token: string;
}

export const login = createAsyncThunk<LoginResponse, string>(
  'user/login',
  async (googleOAuthToken: string) => {
    const url = 'http://localhost:8080/api/v1/auth/login';
    const response = await fetch(url, {
      body: JSON.stringify({
        googleOAuthToken: googleOAuthToken,
      }),
    });

    const data: LoginResponse = await response.json();
    return data;
  }
);

export const { clearUser, setUser } = authSlice.actions;
export const selectUser = (state: RootState) => state.auth.user;

export default authSlice.reducer;
