import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { backend } from '../../utils/constants';

export interface GameweekState {
  gameweek: number;
  isLoading: boolean;
  hasError: boolean;
  opens: string;
  closes: string;
  finishes: string;
}

const initialState: GameweekState = {
  gameweek: 0,
  isLoading: false,
  hasError: false,
  opens: new Date().setDate(1000000).toString(),
  closes: new Date().setDate(1000000).toString(),
  finishes: new Date().setDate(1000000).toString(),
};

const gameweekSlice = createSlice({
  name: 'gameweek',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCurrentGameweek.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentGameweek.rejected, (state) => {
        state.isLoading = false;
        state.hasError = true;
      })
      .addCase(getCurrentGameweek.fulfilled, (state, action: PayloadAction<GameweekResponse>) => {
        state.isLoading = false;

        state.opens = action.payload.opens;
        state.closes = action.payload.closes;
        state.finishes = action.payload.finishes;
        state.gameweek = action.payload.gameweek;
      });
  },
});

interface GameweekResponse {
  gameweek: number;
  opens: string;
  closes: string;
  finishes: string;
}

export const getCurrentGameweek = createAsyncThunk<GameweekResponse>(
  'gameweek/getCurrent',
  async () => {
    const response = await fetch(`${backend}/gw`);

    if (!response.ok) {
      const message: { error: string } = await response.json();
      throw new Error(message.error);
    }

    const gameweek: GameweekResponse = await response.json();
    console.log('gameweek: ', gameweek);
    return gameweek;
  }
);

export default gameweekSlice.reducer;
