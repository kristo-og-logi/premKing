import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { backend } from '../../utils/constants';
import { Bet } from '../../types/Bet';
import { RootState } from '../store';

export interface ScoreState {
  selectedGameweek: number;
  scores: number[];
  isLoading: boolean;
  hasError: boolean;
  createBetIsLoading: boolean;
  createBetHasError: boolean;
}

const initialState: ScoreState = {
  selectedGameweek: 1,
  scores: new Array(38).fill(-1),
  isLoading: true,
  hasError: false,
  createBetIsLoading: false,
  createBetHasError: false,
};

export const scoreSlice = createSlice({
  name: 'scores',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getScore.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getScore.rejected, (state) => {
        state.isLoading = false;
        state.hasError = true;
      })
      .addCase(
        getScore.fulfilled,
        (state, action: PayloadAction<{ score: number; gameweek: number }>) => {
          state.isLoading = false;
          state.scores[action.payload.gameweek - 1] = action.payload.score;
          state.selectedGameweek = action.payload.gameweek;
        }
      );
  },
});

interface GetScoresRequest {
  gameweek: number;
  token: string;
}

interface GetBetsResponse {
  bets: Bet[];
  score: number;
}

export const getScore = createAsyncThunk<
  { score: number; gameweek: number },
  GetScoresRequest,
  { state: RootState }
>('getScore', async ({ gameweek, token }, thunkAPI) => {
  const state = thunkAPI.getState().scores;

  // We already have fetched and stored the score
  if (state.scores[gameweek - 1] != -1) {
    return { score: state.scores[gameweek - 1], gameweek: gameweek };
  }

  const resp = await fetch(`${backend}/users/me/bets/${gameweek}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!resp.ok) {
    if (resp.status === 404) return { score: 0, gameweek };
    const message: { error: string } = await resp.json();
    throw new Error(message.error);
  }

  const response: GetBetsResponse = await resp.json();
  return { score: response.score, gameweek };
});

export default scoreSlice.reducer;
