import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { League } from '../../types/League';

export interface LeagueState {
  leagues: League[];
  isLoading: boolean;
  hasError: boolean;
}

const initialState: LeagueState = {
  leagues: [],
  isLoading: false,
  hasError: false,
};

export const leagueSlice = createSlice({
  name: 'leagues',
  initialState,
  reducers: {
    add: (state, action: PayloadAction<League>) => {
      state.leagues.push(action.payload);
    },
    remove: (state, action: PayloadAction<League>) => {
      return {
        ...state,
        item: state.leagues.filter((num) => num !== action.payload),
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLeagues.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getLeagues.fulfilled, (state, action: PayloadAction<League[]>) => {
        state.isLoading = false;
        state.leagues = action.payload;
      })
      .addCase(getLeagues.rejected, (state) => {
        state.isLoading = false;
        state.hasError = true;
      });
  },
});

export const getLeagues = createAsyncThunk<League[]>('leagues/getLeagues', async () => {
  const url = 'http://localhost:8080/api/v1/leagues';
  const response = await fetch(url);

  const data: League[] = await response.json();
  data.forEach((d) => {
    console.log(d);
  });

  return data;
});

export const { add, remove } = leagueSlice.actions;

export const selectLeagues = (state: RootState) => state.leagues.leagues;

export default leagueSlice.reducer;
