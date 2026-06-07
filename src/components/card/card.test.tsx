import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Card } from './card';
import {
  mockFormData1,
  mockFormData2,
  mockTimestamp,
} from '@/test-utils/form-data.mock';

const bindFunction = vi.hoisted(() => {
  return function classNames(...args: (string | Record<string, boolean>)[]) {
    return args
      .flatMap((argument) => {
        if (typeof argument === 'string') {
          return argument;
        }
        return Object.entries(argument)
          .filter(([, value]) => value)
          .map(([key]) => key);
      })
      .join(' ');
  };
});

vi.mock('classnames/bind', () => ({
  default: bindFunction,
}));

const createCardData = (overrides = {}) => ({
  id: '1',
  createdAt: mockTimestamp,
  ...mockFormData1,
  ...overrides,
});

describe('Card', () => {
  it('renders card with all data corretcly', () => {
    const cardData = createCardData();

    render(<Card data={cardData} />);

    expect(screen.getByText(mockFormData1.name)).toBeInTheDocument();
    expect(screen.getByText(String(mockFormData1.age))).toBeInTheDocument();
    expect(screen.getByText(mockFormData1.email)).toBeInTheDocument();
    expect(screen.getByText(mockFormData1.gender)).toBeInTheDocument();
    expect(screen.getByText(mockFormData1.country)).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
  });

  it('renders terms as No when false', () => {
    const cardData = createCardData({ terms: false });

    render(<Card data={cardData} />);

    expect(screen.getByText('No')).toBeInTheDocument();
  });

  it('renders image when provided', () => {
    const cardData = createCardData({ image: 'test-image.png' });

    render(<Card data={cardData} />);

    const image = screen.getByAltText(mockFormData1.name);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'test-image.png');
  });

  it('does not render image when not provided', () => {
    const cardData = createCardData({ image: null });

    render(<Card data={cardData} />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('renders formatted date correctly', () => {
    const cardData = createCardData();
    const expectedDate = new Date(mockTimestamp).toLocaleString();

    render(<Card data={cardData} />);

    expect(screen.getByText(expectedDate)).toBeInTheDocument();
  });

  it('applies the right class when isRecent is true', () => {
    const cardData = createCardData();

    render(<Card data={cardData} isRecent />);

    const cardElement = screen.getByText(mockFormData1.name).closest('div');
    expect(cardElement?.parentElement?.className).toContain('recent');
  });

  it('does not apply recent class when isRecent is false', () => {
    const cardData = createCardData();

    render(<Card data={cardData} isRecent={false} />);

    const cardElement = screen.getByText(mockFormData1.name).closest('div');
    expect(cardElement?.parentElement?.className).not.toContain('recent');
  });

  it('renders cards with different data', () => {
    const cardData = createCardData(mockFormData2);

    render(<Card data={cardData} />);

    expect(screen.getByText(mockFormData2.name)).toBeInTheDocument();
    expect(screen.getByText(String(mockFormData2.age))).toBeInTheDocument();
    expect(screen.getByText(mockFormData2.email)).toBeInTheDocument();
    expect(screen.getByText(mockFormData2.country)).toBeInTheDocument();
  });

  it('renders labels for each field', () => {
    const cardData = createCardData();

    render(<Card data={cardData} />);

    expect(screen.getByText('Age')).toBeInTheDocument();
    expect(screen.getByText('Gender')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Country')).toBeInTheDocument();
    expect(screen.getByText('Terms accepted')).toBeInTheDocument();
  });
});
