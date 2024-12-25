import { type PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type Score from '../../types/Scores';
import { backend } from '../../utils/constants';

export interface ScoreState {
  selectedGameweek: number;
  scores: Score[];
  isLoading: boolean;
  hasError: boolean;
  createBetIsLoading: boolean;
  createBetHasError: boolean;
}

const initialState: ScoreState = {
  selectedGameweek: 1,
  scores: new Array(38).fill(undefined),
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
      .addCase(fetchScores.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchScores.rejected, (state) => {
        state.isLoading = false;
        state.hasError = true;
      })
      .addCase(fetchScores.fulfilled, (state, action: PayloadAction<Score[]>) => {
        state.isLoading = false;
        state.scores = action.payload;
      });
  },
});

export const fetchScores = createAsyncThunk<Score[], string>('fetchScores', async (token) => {
  const resp = await fetch(`${backend}/users/me/scores`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!resp.ok) {
    if (resp.status === 404) {
      return [];
    }
    const message: { error: string } = await resp.json();
    throw new Error(message.error);
  }

  const response: Score[] = await resp.json();
  return response;
});

export default scoreSlice.reducer;
