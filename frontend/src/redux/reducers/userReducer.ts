import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import User from '../../types/User';
import { RootState } from '../store';

export interface UserState {
  user?: User;
  isLoading: boolean;
  hasError: boolean;
  usersAreLoading: boolean;
  usersHaveError: boolean;
  users: User[];
}

const initialState: UserState = {
  user: undefined,
  isLoading: false,
  hasError: false,
  users: [],
  usersAreLoading: false,
  usersHaveError: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    clearUser: (state) => {
      state.user = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      // getUsers
      .addCase(getUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.usersAreLoading = false;
        state.users = action.payload;
      })
      .addCase(getUsers.pending, (state) => {
        state.usersAreLoading = true;
      })
      .addCase(getUsers.rejected, (state) => {
        state.usersAreLoading = false;
        state.usersHaveError = true;
      })
      // login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state) => {
        state.isLoading = false;
        state.hasError = true;
      });
  },
});

export const getUsers = createAsyncThunk<User[]>('user/getUsers', async () => {
  const url = 'http://localhost:8080/api/v1/users';
  const response = await fetch(url);

  const data: User[] = await response.json();
  return data;
});

type AuthParams = {
  username: string;
  password: string;
};

export const login = createAsyncThunk<User, AuthParams>(
  'user/login',
  async ({ username, password }: AuthParams) => {
    const url = 'http://localhost:8080/api/v1/auth/login';
    const response = await fetch(url, {
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const data: User = await response.json();
    return data;
  }
);

export const selectUser = (state: RootState) => state.user.user;

export default userSlice.reducer;
