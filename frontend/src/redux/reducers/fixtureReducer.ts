import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Fixture from '../../types/Fixture';
// import Gameweek from '../../types/Gameweek';
import { backend } from '../../utils/constants';

export interface FixtureState {
  //   gameweeks: Gameweek[];
  fixtures: Fixture[];
  selectedGameweek: number;
  isLoading: boolean;
  hasError: boolean;
}

const initialState: FixtureState = {
  fixtures: [],
  selectedGameweek: 1,
  isLoading: false,
  hasError: false,
};

export const fixtureSlice = createSlice({
  name: 'fixtures',
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(getFixtures.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFixtures.rejected, (state) => {
        state.isLoading = false;
        state.hasError = true;
      })
      .addCase(getFixtures.fulfilled, (state, action: PayloadAction<Fixture[]>) => {
        state.isLoading = false;
        state.fixtures = action.payload;
      }),
});

export const getFixtures = createAsyncThunk<Fixture[], number>(
  'fixtures/getFixtures',
  async (gameweek) => {
    const response = await fetch(`${backend}/fixtures/${gameweek}`);

    if (!response.ok) {
      const message: { error: string } = await response.json();
      throw new Error(message.error);
    }

    const fixtures: Fixture[] = await response.json();
    return fixtures;
  }
);

export default fixtureSlice.reducer;
