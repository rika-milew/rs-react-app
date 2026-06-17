import { configureStore } from '@reduxjs/toolkit';
import selectedItemsReducer from './slice';
import uiStateReducer from './ui-state-slice';
import { apiSlice } from './api/api-slice';

export const store = configureStore({
  reducer: {
    selectedItems: selectedItemsReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    uiState: uiStateReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
