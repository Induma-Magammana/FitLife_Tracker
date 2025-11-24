import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import exercisesReducer from './slices/exercisesSlice';
import favouritesReducer from './slices/favouritesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    exercises: exercisesReducer,
    favourites: favouritesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
