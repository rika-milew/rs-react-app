import { describe, it, expect } from 'vitest';
import selectedItemsReducer, {
  toggleItem,
  clearAllItems,
  type SelectedItemsState,
} from './slice';

describe('selectedItems slice', () => {
  const initialState: SelectedItemsState = {
    selectedItems: [],
  };

  it('returns initial state correctly', () => {
    expect(selectedItemsReducer(undefined, { type: 'unknown' })).toEqual(
      initialState,
    );
  });

  it('adds item to the store if it is not selected', () => {
    const state = selectedItemsReducer(initialState, toggleItem('1'));
    expect(state.selectedItems).toEqual(['1']);
  });

  it('removes item from the store if it is already selected', () => {
    const initialState: SelectedItemsState = {
      selectedItems: ['1', '2', '3'],
    };

    const state = selectedItemsReducer(initialState, toggleItem('2'));
    expect(state.selectedItems).toEqual(['1', '3']);
  });

  it('adds item to the existing store', () => {
    const initialState: SelectedItemsState = {
      selectedItems: ['1', '2'],
    };

    const state = selectedItemsReducer(initialState, toggleItem('5'));
    expect(state.selectedItems).toEqual(['1', '2', '5']);
  });

  it('clears all selected items with clearAllItems', () => {
    const initialState: SelectedItemsState = {
      selectedItems: ['1', '2', '3'],
    };

    const state = selectedItemsReducer(initialState, clearAllItems());
    expect(state.selectedItems).toEqual([]);
  });
});
