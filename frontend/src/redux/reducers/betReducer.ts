import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { backend } from '../../utils/constants';
import { Bet, Ticket } from '../../types/Bet';

export interface BetState {
  bets: Ticket[];
  selectedGameweek: number;
  isLoading: boolean;
  hasError: boolean;
  createBetIsLoading: boolean;
  createBetHasError: boolean;
}

const initialState: BetState = {
  bets: new Array(38),
  selectedGameweek: 1,
  isLoading: true,
  hasError: false,
  createBetIsLoading: false,
  createBetHasError: false,
};

export const betSlice = createSlice({
  name: 'bets',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //getAllBets
      .addCase(getAllBets.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllBets.rejected, (state) => {
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
      .addCase(
        submitBet.fulfilled,
        (state, action: PayloadAction<{ createdBets: Bet[]; gameweek: number }>) => {
          state.createBetIsLoading = false;
          state.createBetHasError = false;
          state.bets[action.payload.gameweek - 1] = {
            gameweek: action.payload.gameweek,
            bets: action.payload.createdBets,
            score: -1,
          };
          state.selectedGameweek = action.payload.gameweek;
        }
      );
  },
});

export const getAllBets = createAsyncThunk<Ticket[], string>(
  'fixtures/getAllBets',
  async (token) => {
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
  }
);

interface SubmitBetRequest {
  bets: Bet[];
  gameweek: number;
  token: string;
}

export const submitBet = createAsyncThunk<
  { createdBets: Bet[]; gameweek: number },
  SubmitBetRequest
>('fixtures/submitBet', async ({ bets, gameweek, token }) => {
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
});

export default betSlice.reducer;
