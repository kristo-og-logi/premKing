import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface LeagueState {
  items: Array<number>;
}

const initialState: LeagueState = {
  items: [],
};

export const leagueSlice = createSlice({
  name: 'leagues',
  initialState,
  reducers: {
    add: (state, action: PayloadAction<number>) => {
      state.items.push(action.payload);
    },
    remove: (state, action: PayloadAction<number>) => {
      return {
        ...state,
        item: state.items.filter((num) => num !== action.payload),
      };
    },
  },
});

export const { add, remove } = leagueSlice.actions;

export const selectLeagues = (state: RootState) => state.leagues.items;

export default leagueSlice.reducer;
