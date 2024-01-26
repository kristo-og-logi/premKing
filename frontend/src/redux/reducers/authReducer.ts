import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import User from '../../types/User';
import { RootState } from '../store';
import { saveTokenInStorage } from '../../utils/storage';

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
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          googleToken: googleOAuthToken,
        }),
      });

      const data: LoginResponse = await response.json();
      await saveTokenInStorage(data);

      return data;
    } catch (error) {
      console.log('ERROR logging in: ', error);
      throw error;
    }
  }
);

export const { clearUser, setUser, setUserDataFromStorage } = authSlice.actions;
export const selectUser = (state: RootState) => state.auth.user;

export default authSlice.reducer;
