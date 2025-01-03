import { type PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RejectedActionFromAsyncThunk } from '@reduxjs/toolkit/dist/matchers';
import type { League, SelectedLeague } from '../../types/League';
import { backend } from '../../utils/constants';
import type { RootState } from '../store';

export interface LeagueState {
  leagues: League[];
  isLoading: boolean;
  hasError: boolean;
  selectedLeague?: SelectedLeague;
  selectedIsLoading: boolean;
  selectedHasError: boolean;
  joinActive: boolean;
  joinIsLoading: boolean;
  joinHasError: boolean;
  joinErrorMessage: string;
}

const initialState: LeagueState = {
  leagues: [],
  isLoading: false,
  hasError: false,
  selectedLeague: undefined,
  selectedIsLoading: false,
  selectedHasError: false,
  joinActive: false,
  joinIsLoading: false,
  joinHasError: false,
  joinErrorMessage: '',
};

export const leagueSlice = createSlice({
  name: 'leagues',
  initialState,
  reducers: {
    remove: (state, action: PayloadAction<League>) => {
      state.leagues = state.leagues.filter((num) => num !== action.payload);
    },
    unselect: (state) => {
      state.selectedHasError = false;
      state.selectedIsLoading = false;
      state.selectedLeague = undefined;
    },
    setJoinLeagueActive: (state) => {
      state.joinActive = true;
      state.joinHasError = false;
      state.joinIsLoading = false;
    },
    removeJoinLeagueError: (state) => {
      state.joinHasError = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMyLeagues.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMyLeagues.fulfilled, (state, action: PayloadAction<League[]>) => {
        state.isLoading = false;
        state.leagues = action.payload;
      })
      .addCase(getMyLeagues.rejected, (state) => {
        state.isLoading = false;
        state.hasError = true;
      })
      // getSelectedLeague
      .addCase(getSelectedLeague.pending, (state) => {
        state.selectedIsLoading = true;
      })
      .addCase(getSelectedLeague.rejected, (state) => {
        state.selectedIsLoading = false;
        state.hasError = true;
      })
      .addCase(getSelectedLeague.fulfilled, (state, action: PayloadAction<SelectedLeague>) => {
        state.selectedIsLoading = false;
        state.selectedLeague = action.payload;
      })
      // createLeague
      .addCase(createLeague.fulfilled, (state, action: PayloadAction<League>) => {
        state.leagues.push(action.payload);
      })
      // joinLeague
      .addCase(joinLeague.pending, (state) => {
        state.joinIsLoading = true;
      })
      .addCase(joinLeague.rejected, (state, action: RejectedActionFromAsyncThunk<typeof joinLeague>) => {
        console.log('in builder: action = ', action);
        state.joinHasError = true;
        state.joinIsLoading = false;
        state.joinErrorMessage = action.error.message ?? '';
      })
      .addCase(joinLeague.fulfilled, (state, action: PayloadAction<League>) => {
        state.joinIsLoading = false;
        state.leagues.push(action.payload);
        state.joinActive = false;
      });
  },
});

const leagueUrl = `${backend}/leagues`;

interface GetSelectedLeagueParams {
  leagueId: string;
  token: string;
}
export const getSelectedLeague = createAsyncThunk<SelectedLeague, GetSelectedLeagueParams>(
  'leagues/getSelectedLeagues',
  async ({ leagueId, token }: GetSelectedLeagueParams) => {
    try {
      const response = await fetch(`${leagueUrl}/${leagueId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorJson: { error: string } = await response.json();
        throw new Error(errorJson.error);
      }

      const data: SelectedLeague = await response.json();
      return data;
    } catch (error) {
      console.log('ERROR: ', error);
      throw error;
    }
  },
);

interface CreateLeagueParams {
  token: string;
  leagueName: string;
}

export const createLeague = createAsyncThunk<League, CreateLeagueParams>(
  'leagues/createLeague',
  async ({ token, leagueName }: CreateLeagueParams) => {
    const response = await fetch(`${backend}/users/me/leagues`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ leagueName: leagueName }),
    });

    if (!response.ok) {
      const message: { error: string } = await response.json();
      throw new Error(message.error);
    }

    const data: League = await response.json();
    return data;
  },
);

export const getMyLeagues = createAsyncThunk<League[], string>('leagues/getMyLeagues', async (token) => {
  try {
    const response = await fetch(`${backend}/users/me/leagues`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const message: { error: string } = await response.json();
      throw new Error(message.error);
    }

    const myLeagues: League[] = await response.json();
    return myLeagues;
  } catch (error) {
    console.log('ERROR in leagues/getMyLeagues: ', error);
    throw error;
  }
});

interface JoinLeagueParams {
  token: string;
  leagueId: string;
}

export const joinLeague = createAsyncThunk<League, JoinLeagueParams>(
  'leagues/joinLeague',
  async ({ token, leagueId }: JoinLeagueParams) => {
    try {
      const response = await fetch(`${backend}/leagues/${leagueId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data: { error: string } = await response.json();
        throw new Error(data.error);
      }

      const joinedLeague: League = await response.json();
      return joinedLeague;
    } catch (error) {
      console.log('ERROR in leagues/joinLeague: ', error);
      throw error;
    }
  },
);

export const { remove, unselect, setJoinLeagueActive, removeJoinLeagueError } = leagueSlice.actions;

export const selectLeagues = (state: RootState) => state.leagues.leagues;

export default leagueSlice.reducer;
