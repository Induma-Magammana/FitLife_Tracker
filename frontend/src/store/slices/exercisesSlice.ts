import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Exercise {
  name: string;
  type: string;
  muscle: string;
  equipment: string;
  difficulty: string;
  instructions: string;
}

interface ExercisesState {
  exercises: Exercise[];
  loading: boolean;
  error: string | null;
}

const initialState: ExercisesState = {
  exercises: [],
  loading: false,
  error: null,
};

const exercisesSlice = createSlice({
  name: 'exercises',
  initialState,
  reducers: {
    setExercises: (state, action: PayloadAction<Exercise[]>) => {
      state.exercises = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setExercises, setLoading, setError } = exercisesSlice.actions;
export default exercisesSlice.reducer;
