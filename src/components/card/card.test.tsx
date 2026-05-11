import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Card, ID_LENGTH } from './card';

import {
  mockPokemonFull,
  mockPokemonPartial,
  artworkMockImage,
} from '@/test-utils/api-mock';

describe('card component', () => {
  describe('with full data', () => {
    it('renders all pokemon information on the card', () => {
      render(<Card pokemon={mockPokemonFull} />);

      const expectedName =
        mockPokemonFull.name.charAt(0).toUpperCase() +
        mockPokemonFull.name.slice(1);
      expect(
        screen.getByRole('heading', { name: expectedName })
      ).toBeInTheDocument();

      const expectedId = `#${mockPokemonFull.id.toString().padStart(ID_LENGTH, '0')}`;
      expect(screen.getByText(expectedId)).toBeInTheDocument();

      const expectedTypes = mockPokemonFull.types
        .map((index) => index.type.name)
        .join(', ');
      const types = screen.getByText('Types:');
      expect(types.nextElementSibling).toHaveTextContent(expectedTypes);

      const expectedAbilities = mockPokemonFull.abilities
        .map((index) => index.ability.name)
        .join(', ');
      const abilities = screen.getByText('Abilities:');
      expect(abilities.nextElementSibling).toHaveTextContent(expectedAbilities);

      const expectedHeight = `${String(mockPokemonFull.height * 10)} cm`;
      const expectedWeight = `${String(mockPokemonFull.weight / 10)} kg`;
      expect(screen.getByText(expectedHeight)).toBeInTheDocument();
      expect(screen.getByText(expectedWeight)).toBeInTheDocument();

      expect(screen.getByText('Description:')).toBeInTheDocument();
      if (mockPokemonFull.description) {
        expect(
          screen.getByText(mockPokemonFull.description)
        ).toBeInTheDocument();
      }
    });

    it('renders artwork image with correct attributes', () => {
      render(<Card pokemon={mockPokemonFull} />);

      const image = screen.getByRole('img', { name: mockPokemonFull.name });
      expect(image).toHaveAttribute('src', artworkMockImage);
    });

    it('renders pokemon name with capital letter', () => {
      render(<Card pokemon={mockPokemonFull} />);

      expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
    });

    it('renders card container element', () => {
      const { container } = render(<Card pokemon={mockPokemonFull} />);
      const cardElement = container.firstChild;

      expect(cardElement).toBeInTheDocument();
    });
  });

  describe('with partial pokemon data', () => {
    it('renders single type without trailing comma', () => {
      render(<Card pokemon={mockPokemonPartial} />);

      const expectedType = mockPokemonPartial.types
        .map((index) => index.type.name)
        .join(', ');

      expect(screen.getByText('Types:').nextElementSibling).toHaveTextContent(
        expectedType
      );

      expect(expectedType).not.toContain(',');
    });

    it('uses front_default image when artwork image is missing', () => {
      render(<Card pokemon={mockPokemonPartial} />);

      const image = screen.getByRole('img', { name: mockPokemonPartial.name });
      expect(image).toHaveAttribute(
        'src',
        mockPokemonPartial.sprites.front_default
      );
    });

    it('does not render description section when description is undefined', () => {
      render(<Card pokemon={mockPokemonPartial} />);

      expect(mockPokemonPartial.description).toBeUndefined();
      expect(screen.queryByText('Description:')).not.toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('handles empty name without crashing', () => {
      const pokemonWithEmptyName = { ...mockPokemonFull, name: '' };

      render(<Card pokemon={pokemonWithEmptyName} />);

      expect(screen.getByRole('heading')).toBeInTheDocument();
    });
  });
});
