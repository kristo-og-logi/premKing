import { BACKEND_URL } from '@env';
import { type PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type User from '../../types/User';
import type { RootState } from '../store';

export interface UserState {
  isLoading: boolean;
  hasError: boolean;
  users: User[];
}

const initialState: UserState = {
  users: [],
  isLoading: false,
  hasError: false,
};

export const getUsers = createAsyncThunk<User[]>('user/getUsers', async () => {
  const url = `${BACKEND_URL}/api/v1/users`;
  const response = await fetch(url);

  const data: User[] = await response.json();
  return data;
});

export const usersSlice = createSlice({
  name: 'users',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // getUsers
      .addCase(getUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(getUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUsers.rejected, (state) => {
        state.isLoading = false;
        state.hasError = true;
      });
  },
});

export const selectUsers = (state: RootState) => state.users.users;
export default usersSlice.reducer;
