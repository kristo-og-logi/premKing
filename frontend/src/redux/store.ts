import { configureStore } from '@reduxjs/toolkit';
import leaguesReducer from './reducers/leaguesReducer';
import usersReducer from './reducers/usersReducer';
import authReducer from './reducers/authReducer';
import fixtureReducer from './reducers/fixtureReducer';
import gameweekReducer from './reducers/gameweekReducer';

export const store = configureStore({
  reducer: {
    leagues: leaguesReducer,
    users: usersReducer,
    auth: authReducer,
    fixtures: fixtureReducer,
    gameweek: gameweekReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
