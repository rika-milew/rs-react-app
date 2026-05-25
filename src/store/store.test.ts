import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import type { EnhancedStore } from '@reduxjs/toolkit';
import selectedItemsReducer, { toggleItem, clearAllItems } from './slice';

const createTestStore = (): EnhancedStore => {
  return configureStore({
    reducer: {
      selectedItems: selectedItemsReducer,
    },
  });
};

describe('Store', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
  });

  it('initializes store with empty selected items', () => {
    expect(store.getState().selectedItems.selectedItems).toEqual([]);
  });

  it('handles item toggle action correctly', () => {
    store.dispatch(toggleItem('1'));
    store.dispatch(toggleItem('3'));
    store.dispatch(toggleItem('2'));
    store.dispatch(toggleItem('3'));

    expect(store.getState().selectedItems.selectedItems).toEqual(['1', '2']);
  });

  it('handles clearAllItems action', () => {
    store.dispatch(toggleItem('1'));
    store.dispatch(toggleItem('2'));
    store.dispatch(toggleItem('5'));
    store.dispatch(clearAllItems());

    expect(store.getState().selectedItems.selectedItems).toEqual([]);
  });
});
