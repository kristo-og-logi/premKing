import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authReducer';
import betReducer from './reducers/betReducer';
import fixtureReducer from './reducers/fixtureReducer';
import gameweekReducer from './reducers/gameweekReducer';
import leaguesReducer from './reducers/leaguesReducer';
import scoreReducer from './reducers/scoreReducer';
import usersReducer from './reducers/usersReducer';

export const store = configureStore({
  reducer: {
    leagues: leaguesReducer,
    users: usersReducer,
    auth: authReducer,
    fixtures: fixtureReducer,
    gameweek: gameweekReducer,
    bets: betReducer,
    scores: scoreReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
