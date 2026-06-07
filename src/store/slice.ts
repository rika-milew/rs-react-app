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

      return {
        ...state,
        selectedItems: isSelected
          ? state.selectedItems.filter((item) => item !== id)
          : [...state.selectedItems, id],
      };
    },
    clearAllItems: (state) => {
      return {
        ...state,
        selectedItems: [],
      };
    },
  },
});

export const { toggleItem, clearAllItems } = selectedItemsSlice.actions;
export default selectedItemsSlice.reducer;
