import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { League } from '../../types/League';

export interface LeagueState {
  leagues: League[];
  isLoading: boolean;
  hasError: boolean;
  selectedLeague?: League;
  selectedIsLoading: boolean;
  selectedHasError: boolean;
}

const initialState: LeagueState = {
  leagues: [],
  isLoading: false,
  hasError: false,
  selectedLeague: undefined,
  selectedIsLoading: false,
  selectedHasError: false,
};

export const leagueSlice = createSlice({
  name: 'leagues',
  initialState,
  reducers: {
    add: (state, action: PayloadAction<League>) => {
      state.leagues.push(action.payload);
    },
    remove: (state, action: PayloadAction<League>) => {
      state.leagues = state.leagues.filter((num) => num !== action.payload);
    },
    unselect: (state) => {
      state.selectedHasError = false;
      state.selectedIsLoading = false;
      state.selectedLeague = undefined;
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
      })
      // getSelectedLeague
      .addCase(getSelectedLeague.pending, (state) => {
        state.selectedIsLoading = true;
      })
      .addCase(getSelectedLeague.fulfilled, (state, action: PayloadAction<League>) => {
        state.selectedIsLoading = false;
        state.selectedLeague = action.payload;
      })
      .addCase(getSelectedLeague.rejected, (state) => {
        state.selectedIsLoading = false;
        state.hasError = true;
      })
      // createLeague
      .addCase(createLeague.fulfilled, (state, action: PayloadAction<League>) => {
        state.leagues.push(action.payload);
      });
  },
});

const leagueUrl = 'http://localhost:8080/api/v1/leagues';
export const backend = 'http://localhost:8080/api/v1';

export const getLeagues = createAsyncThunk<League[]>('leagues/getLeagues', async () => {
  const response = await fetch(leagueUrl);

  const data: League[] = await response.json();
  return data;
});

export const getSelectedLeague = createAsyncThunk<League, string>(
  'leagues/getSelectedLeagues',
  async (leagueId: string) => {
    const response = await fetch(`${leagueUrl}/${leagueId}`);

    const data: League = await response.json();
    return data;
  }
);

interface CreateLeagueParams {
  token: string;
  leagueName: string;
}

export const createLeague = createAsyncThunk<League, CreateLeagueParams>(
  'leagues/createLeague',
  async ({ token, leagueName }: CreateLeagueParams) => {
    console.log('token is: ', token);
    const response = await fetch(`${backend}/users/me/leagues`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ leagueName: leagueName }),
    });

    const data: League = await response.json();

    console.log('new league: ', data);
    return data;
  }
);

export const { add, remove, unselect } = leagueSlice.actions;

export const selectLeagues = (state: RootState) => state.leagues.leagues;

export default leagueSlice.reducer;
