import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HomePage } from './home-page';
import { CardsSection } from '@/components/cards-section/cards-section';
import { useFormDataStore } from '@/store/use-form-data-store';

import {
  mockUUID,
  mockUUID2,
  mockTimestamp,
  mockFormData1,
  mockFormData2,
} from '@/test-utils/form-data.mock';

type ButtonProps = {
  text: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
};

type ModalProps = {
  isVisible: boolean;
  onClose: () => void;
  children: ReactNode;
};

type CardProps = {
  data: {
    id: string;
    name: string;
    age: number;
    email: string;
    gender: string;
    terms: boolean;
    password: string;
    confirmPassword: string;
    country: string;
    image: string | null;
    createdAt: number;
  };
  isRecent: boolean;
};

type FormProps = {
  onSuccess: () => void;
};

const mockCards = [
  {
    ...mockFormData1,
    id: mockUUID,
    createdAt: mockTimestamp,
  },
  {
    ...mockFormData2,
    id: mockUUID2,
    createdAt: mockTimestamp + 1000,
  },
];

vi.mock('@/components/button/button', () => ({
  Button: vi.fn(({ text, onClick, variant }: ButtonProps) => (
    <button onClick={onClick} data-variant={variant}>
      {text}
    </button>
  )),
}));

vi.mock('@/components/modal/modal', () => ({
  Modal: vi.fn(({ isVisible, onClose, children }: ModalProps) =>
    isVisible ? (
      <div data-testid="modal">
        <button onClick={onClose}>Close</button>
        {children}
      </div>
    ) : null,
  ),
}));

vi.mock('@/components/forms/uncontrolled-form', () => ({
  UncontrolledForm: vi.fn(({ onSuccess }: FormProps) => (
    <div data-testid="uncontrolled-form">
      <button onClick={onSuccess}>Submit Uncontrolled Form</button>
    </div>
  )),
}));

vi.mock('@/components/forms/controlled-form', () => ({
  ControlledForm: vi.fn(({ onSuccess }: FormProps) => (
    <div data-testid="controlled-form">
      <button onClick={onSuccess}>Submit Controlled Form</button>
    </div>
  )),
}));

vi.mock('@/components/card/card', () => ({
  Card: vi.fn(({ data, isRecent }: CardProps) => (
    <div data-testid={`card-${data.id}`} data-recent={isRecent}>
      {data.name}
    </div>
  )),
}));

vi.mock('@/constants/constants', () => ({
  ANIMATION_DURATION: 300,
}));

describe('HomePage', () => {
  beforeEach(() => {
    useFormDataStore.setState({ submissions: [] });
  });

  it('renders title and buttons correctly', () => {
    render(<HomePage />);

    expect(screen.getByText('React Forms')).toBeInTheDocument();
    expect(screen.getByText('Open Uncontrolled Form')).toBeInTheDocument();
    expect(screen.getByText('Open Controlled Form')).toBeInTheDocument();
  });

  it('opens uncontrolled form modal', async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    await user.click(screen.getByText('Open Uncontrolled Form'));

    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByTestId('uncontrolled-form')).toBeInTheDocument();
  });

  it('opens controlled form modal', async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    await user.click(screen.getByText('Open Controlled Form'));

    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByTestId('controlled-form')).toBeInTheDocument();
  });

  it('closes modal on success submission', async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    await user.click(screen.getByText('Open Uncontrolled Form'));
    await user.click(screen.getByText('Submit Uncontrolled Form'));

    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('closes modal on close button', async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    await user.click(screen.getByText('Open Uncontrolled Form'));
    await user.click(screen.getByText('Close'));

    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });
});

describe('CardsSection', () => {
  beforeEach(() => {
    useFormDataStore.setState({ submissions: [] });
  });

  it('shows empty state when no cards', () => {
    render(<CardsSection recentCardId={null} />);

    expect(screen.getByText('No submissions yet')).toBeInTheDocument();
    expect(
      screen.getByText('Fill in the form to get started'),
    ).toBeInTheDocument();
  });

  it('renders cards from store', () => {
    useFormDataStore.setState({ submissions: mockCards });

    render(<CardsSection recentCardId={null} />);

    expect(screen.getByText('Submissions History')).toBeInTheDocument();
    expect(screen.getByText(mockFormData1.name)).toBeInTheDocument();
    expect(screen.getByText(mockFormData2.name)).toBeInTheDocument();
    expect(screen.getByText('2 items')).toBeInTheDocument();
  });

  it('shows item text for one card', () => {
    useFormDataStore.setState({ submissions: [mockCards[0]] });

    render(<CardsSection recentCardId={null} />);

    expect(screen.getByText('1 item')).toBeInTheDocument();
  });

  it('marks recent card', () => {
    useFormDataStore.setState({ submissions: mockCards });

    render(<CardsSection recentCardId={mockCards[0].id} />);

    const card = screen.getByTestId(`card-${mockCards[0].id}`);
    expect(card.dataset.recent).toBe('true');
  });

  it('does not mark non-recent cards', () => {
    useFormDataStore.setState({ submissions: mockCards });

    render(<CardsSection recentCardId={mockCards[0].id} />);

    const recentCard = screen.getByTestId(`card-${mockCards[0].id}`);
    const card = screen.getByTestId(`card-${mockCards[1].id}`);

    expect(recentCard.dataset.recent).toBe('true');
    expect(card.dataset.recent).toBe('false');
  });
});
