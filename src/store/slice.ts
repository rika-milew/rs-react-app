import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type SelectedItemsState = {
  SelectedItems: string[];
};

const initialState: SelectedItemsState = {
  SelectedItems: [],
};

export const selectedItemsSlice = createSlice({
  name: 'selectedItems',
  initialState,
  reducers: {
    toggleItem: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const isSelected = state.SelectedItems.includes(id);

      if (isSelected) {
        state.SelectedItems = state.SelectedItems.filter((item) => item !== id);
      } else {
        state.SelectedItems.push(id);
      }
    },
    clearAllItems: (state) => {
      state.SelectedItems = [];
    },
  },
});

export const { toggleItem, clearAllItems } = selectedItemsSlice.actions;
export default selectedItemsSlice.reducer;
