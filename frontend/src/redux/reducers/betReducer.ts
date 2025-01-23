import { BACKEND_URL } from '@env';
import { type PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RejectedActionFromAsyncThunk } from '@reduxjs/toolkit/dist/matchers';
import type { Bet, FriendBets, Ticket } from '../../types/Bet';
import { backend } from '../../utils/constants';

export interface BetState {
  bets: Ticket[];
  selectedGameweek: number;
  isLoading: boolean;
  hasError: boolean;
  createBetIsLoading: boolean;
  createBetHasError: boolean;
  friendBets?: FriendBets;
  friendBetsIsLoading: boolean;
  friendBetsHasError: boolean;
}

const initialState: BetState = {
  bets: new Array(38),
  selectedGameweek: 1,
  isLoading: true,
  hasError: false,
  createBetIsLoading: false,
  createBetHasError: false,
  friendBets: undefined,
  friendBetsIsLoading: false,
  friendBetsHasError: false,
};

export const betSlice = createSlice({
  name: 'bets',
  initialState,
  reducers: {
    setSelectedGameweek(state, action: PayloadAction<number>) {
      state.selectedGameweek = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      //getAllBets
      .addCase(getAllBets.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllBets.rejected, (state) => {
        console.error('failed to get bets');
        state.isLoading = false;
        state.hasError = true;
      })
      .addCase(getAllBets.fulfilled, (state, action: PayloadAction<Ticket[]>) => {
        state.isLoading = false;
        state.bets = action.payload;
      })
      // submitBet
      .addCase(submitBet.pending, (state) => {
        state.createBetIsLoading = true;
      })
      .addCase(submitBet.rejected, (state) => {
        state.createBetIsLoading = false;
        state.createBetHasError = true;
      })
      .addCase(submitBet.fulfilled, (state, action: PayloadAction<{ createdBets: Bet[]; gameweek: number }>) => {
        state.createBetIsLoading = false;
        state.createBetHasError = false;
        state.bets[action.payload.gameweek - 1] = {
          gameweek: action.payload.gameweek,
          bets: action.payload.createdBets,
          score: 0,
        };
        state.selectedGameweek = action.payload.gameweek;
      })
      .addCase(getFriendBets.pending, (state) => {
        state.friendBetsIsLoading = true;
        state.friendBetsHasError = false;
      })
      .addCase(getFriendBets.rejected, (state, action: RejectedActionFromAsyncThunk<typeof getFriendBets>) => {
        state.friendBetsHasError = true;
        state.friendBetsIsLoading = false;
        console.error('rejected', action.error.message);
      })
      .addCase(getFriendBets.fulfilled, (state, action: PayloadAction<FriendBets>) => {
        state.friendBets = action.payload;
        state.friendBetsHasError = false;
        state.friendBetsIsLoading = false;
      });
  },
});

export const getAllBets = createAsyncThunk<Ticket[], string>('fixtures/getAllBets', async (token) => {
  const resp = await fetch(`${backend}/users/me/bets`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!resp.ok) {
    const message: { error: string } = await resp.json();
    throw new Error(message.error);
  }

  const response: Ticket[] = await resp.json();
  return response;
});

interface SubmitBetRequest {
  bets: Bet[];
  gameweek: number;
  token: string;
}

export const submitBet = createAsyncThunk<{ createdBets: Bet[]; gameweek: number }, SubmitBetRequest>(
  'fixtures/submitBet',
  async ({ bets, gameweek, token }) => {
    const response = await fetch(`${backend}/users/me/bets/${gameweek}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-type': 'application/json',
      },
      body: `{ "bets": ${JSON.stringify(bets)} }`,
    });

    if (!response.ok) {
      if (response.status === 404) return { createdBets: [], gameweek };
      const message: { error: string } = await response.json();
      console.error(`submitBet ERROR: ${message.error}`);
      throw new Error(message.error);
    }

    const createdBets: Bet[] = await response.json();
    return { createdBets, gameweek };
  },
);

interface FriendBetsRequest {
  userId: string;
  gw: number;
  token: string;
}
export const getFriendBets = createAsyncThunk<FriendBets, FriendBetsRequest>(
  'fixtures/friendBets',
  async ({ userId, gw, token }: FriendBetsRequest) => {
    try {
      const url = `${BACKEND_URL}/api/v1/users/${userId}/bets`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const message: { error: string } = await response.json();
        throw new Error(message.error);
      }

      const friendBets: FriendBets = await response.json();
      return friendBets;
    } catch (err) {
      console.error('there was an error', err);
      throw err;
    }
  },
);

export const { setSelectedGameweek } = betSlice.actions;

export default betSlice.reducer;
