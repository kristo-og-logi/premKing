import { type PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { backend } from '../../utils/constants';
import type Gameweek from '../../types/Gameweek';

export interface GameweekState {
  currentGameweek: number;
  allGameweeks: Gameweek[];
  isLoading: boolean;
  hasError: boolean;
}

const initialState: GameweekState = {
  currentGameweek: 0,
  allGameweeks: [],
  isLoading: false,
  hasError: false,
};

const gameweekSlice = createSlice({
  name: 'gameweek',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllGameweeks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllGameweeks.rejected, (state) => {
        state.isLoading = false;
        state.hasError = true;
      })
      .addCase(getAllGameweeks.fulfilled, (state, action: PayloadAction<GameweekResponse>) => {
        state.isLoading = false;
        state.currentGameweek = action.payload.current;
        state.allGameweeks = action.payload.gameweeks;
      });
  },
});

interface GameweekResponse {
  current: number;
  gameweeks: Gameweek[];
}

export const getAllGameweeks = createAsyncThunk<GameweekResponse>('gameweek/getAll', async () => {
  const response = await fetch(`${backend}/gw`);

  if (!response.ok) {
    const message: { error: string } = await response.json();
    throw new Error(message.error);
  }

  const gameweeks: GameweekResponse = await response.json();
  return gameweeks;
});

export default gameweekSlice.reducer;
