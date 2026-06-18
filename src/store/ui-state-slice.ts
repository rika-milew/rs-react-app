import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type UiState = {
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: string | null;
  totalPages: number;
};

const initialState: UiState = {
  isLoading: false,
  isFetching: false,
  isError: false,
  error: null,
  totalPages: 0,
};

export const uiStateSlice = createSlice({
  name: 'uiState',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      if (action.payload) {
        state.isError = false;
        state.error = null;
      }
    },
    setFetching: (state, action: PayloadAction<boolean>) => {
      state.isFetching = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.isError = true;
      state.error = action.payload;
      state.isLoading = false;
    },
    setTotalPages: (state, action: PayloadAction<number>) => {
      state.totalPages = action.payload;
    },
    resetError: (state) => {
      state.isError = false;
      state.error = null;
    },
  },
});

export const { setLoading, setError, setFetching, setTotalPages, resetError } =
  uiStateSlice.actions;
export default uiStateSlice.reducer;
