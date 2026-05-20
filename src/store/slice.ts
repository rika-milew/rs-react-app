import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type SelectedItemsState = {
  selectedItems: string[];
};

const initialState: SelectedItemsState = {
  selectedItems: [],
};

export const selectedItemsSlice = createSlice({
  name: 'selectedItems',
  initialState,
  reducers: {
    toggleItem: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const isSelected = state.selectedItems.includes(id);

      if (isSelected) {
        state.selectedItems = state.selectedItems.filter((item) => item !== id);
      } else {
        state.selectedItems.push(id);
      }
    },
    clearAllItems: (state) => {
      state.selectedItems = [];
    },
  },
});

export const { toggleItem, clearAllItems } = selectedItemsSlice.actions;
export default selectedItemsSlice.reducer;
