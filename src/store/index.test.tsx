import { describe, it, expect } from 'vitest';
import { store } from './index';

describe('Store configuration', () => {
  it('creates store with selectedItems reducer', () => {
    const state = store.getState();

    expect(state).toHaveProperty('selectedItems');
    expect(state.selectedItems).toHaveProperty('selectedItems');
  });

  it('has store instance', () => {
    expect(store).toBeDefined();
    expect(typeof store.dispatch).toBe('function');
    expect(typeof store.getState).toBe('function');
  });
});
