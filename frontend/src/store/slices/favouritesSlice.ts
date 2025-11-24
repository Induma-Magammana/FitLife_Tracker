import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Exercise } from './exercisesSlice';

interface FavouritesState {
  favourites: Exercise[];
}

const initialState: FavouritesState = {
  favourites: [],
};

const favouritesSlice = createSlice({
  name: 'favourites',
  initialState,
  reducers: {
    addFavourite: (state, action: PayloadAction<Exercise>) => {
      const exists = state.favourites.find(
        (ex) => ex.name === action.payload.name
      );
      if (!exists) {
        state.favourites.push(action.payload);
      }
    },
    removeFavourite: (state, action: PayloadAction<string>) => {
      state.favourites = state.favourites.filter(
        (ex) => ex.name !== action.payload
      );
    },
    setFavourites: (state, action: PayloadAction<Exercise[]>) => {
      state.favourites = action.payload;
    },
  },
});

export const { addFavourite, removeFavourite, setFavourites } = favouritesSlice.actions;
export default favouritesSlice.reducer;
