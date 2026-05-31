import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Card, ID_LENGTH } from './card';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '@/store/api/api-slice';
import {
  mockItemFull,
  mockItemPartial,
  artworkMockImage,
} from '@/test-utils/api-mock';

const EMPTY_STORE: string[] = [];
const INITIAL_SELECTED_ITEMS = { selectedItems: EMPTY_STORE };

const createMockStore = () => {
  return configureStore({
    reducer: {
      selectedItems: (state = INITIAL_SELECTED_ITEMS) => state,
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
  });
};

describe('card component', () => {
  const renderWithProvider = (ui: React.ReactElement) => {
    const store = createMockStore();
    return {
      ...render(<Provider store={store}>{ui}</Provider>),
      store,
    };
  };

  describe('with full data', () => {
    it('renders all item information on the card', () => {
      renderWithProvider(<Card item={mockItemFull} />);

      const expectedName =
        mockItemFull.name.charAt(0).toUpperCase() + mockItemFull.name.slice(1);
      expect(
        screen.getByRole('heading', { name: expectedName }),
      ).toBeInTheDocument();

      const expectedId = `#${mockItemFull.id.toString().padStart(ID_LENGTH, '0')}`;
      expect(screen.getByText(expectedId)).toBeInTheDocument();

      const expectedTypes = mockItemFull.types
        .map((index) => index.type.name)
        .join(', ');
      const types = screen.getByText('Types:');
      expect(types.nextElementSibling).toHaveTextContent(expectedTypes);

      const expectedAbilities = mockItemFull.abilities
        .map((index) => index.ability.name)
        .join(', ');
      const abilities = screen.getByText('Abilities:');
      expect(abilities.nextElementSibling).toHaveTextContent(expectedAbilities);

      const expectedHeight = `${String(mockItemFull.height * 10)} cm`;
      const expectedWeight = `${String(mockItemFull.weight / 10)} kg`;
      expect(screen.getByText(expectedHeight)).toBeInTheDocument();
      expect(screen.getByText(expectedWeight)).toBeInTheDocument();

      expect(screen.getByText('Description:')).toBeInTheDocument();
      if (mockItemFull.description) {
        expect(screen.getByText(mockItemFull.description)).toBeInTheDocument();
      }
    });

    it('renders artwork image with correct attributes', () => {
      renderWithProvider(<Card item={mockItemFull} />);

      const image = screen.getByRole('img', {
        name: mockItemFull.name,
      });

      expect(image).toHaveAttribute('src', artworkMockImage);
    });

    it('renders item name with capital letter', () => {
      renderWithProvider(<Card item={mockItemFull} />);

      expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
    });

    it('renders card container element', () => {
      const { container } = renderWithProvider(<Card item={mockItemFull} />);
      const cardElement = container.firstChild;

      expect(cardElement).toBeInTheDocument();
    });
  });

  describe('with partial item data', () => {
    it('renders single type without trailing comma', () => {
      renderWithProvider(<Card item={mockItemPartial} />);

      const expectedType = mockItemPartial.types
        .map((index) => index.type.name)
        .join(', ');

      expect(screen.getByText('Types:').nextElementSibling).toHaveTextContent(
        expectedType,
      );

      expect(expectedType).not.toContain(',');
    });

    it('uses front_default image when artwork image is missing', () => {
      renderWithProvider(<Card item={mockItemPartial} />);

      const image = screen.getByRole('img', {
        name: mockItemPartial.name,
      });

      expect(image).toHaveAttribute(
        'src',
        mockItemPartial.sprites.front_default,
      );
    });

    it('does not render description section when description is undefined', () => {
      renderWithProvider(<Card item={mockItemPartial} />);

      expect(mockItemPartial.description).toBeUndefined();
      expect(screen.queryByText('Description:')).not.toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('handles empty name without crashing', () => {
      const itemWithEmptyName = { ...mockItemFull, name: '' };

      renderWithProvider(<Card item={itemWithEmptyName} />);

      expect(screen.getByRole('heading')).toBeInTheDocument();
    });
  });
});
