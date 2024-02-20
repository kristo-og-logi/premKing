import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { backend } from '../../utils/constants';
import { Bet } from '../../types/Bet';

export interface BetState {
  bets: Bet[];
  notFound: boolean;
  selectedGameweek: number;
  isLoading: boolean;
  hasError: boolean;
}

const initialState: BetState = {
  bets: [],
  notFound: false,
  selectedGameweek: 1,
  isLoading: false,
  hasError: false,
};

export const betSlice = createSlice({
  name: 'bets',
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(getBets.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBets.rejected, (state) => {
        state.isLoading = false;
        state.hasError = true;
      })
      .addCase(
        getBets.fulfilled,
        (state, action: PayloadAction<{ bets: Bet[]; gameweek: number }>) => {
          state.isLoading = false;
          if (action.payload.bets.length === 0) {
            state.notFound = true;
          } else {
            state.notFound = false;
          }
          state.bets = action.payload.bets;
          state.selectedGameweek = action.payload.gameweek;
        }
      ),
});

interface GetBetsRequest {
  gameweek: number;
  token: string;
}

export const getBets = createAsyncThunk<{ bets: Bet[]; gameweek: number }, GetBetsRequest>(
  'fixtures/getBets',
  async ({ gameweek, token }) => {
    const response = await fetch(`${backend}/users/me/bets/${gameweek}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) return { bets: [], gameweek };
      const message: { error: string } = await response.json();
      throw new Error(message.error);
    }

    const bets: Bet[] = await response.json();
    return { bets, gameweek };
  }
);

export default betSlice.reducer;
