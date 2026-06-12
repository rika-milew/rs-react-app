import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PasswordIndicator } from './password-indicator';
import {
  mockValidPassword,
  mockInvalidPassword,
} from '@/test-utils/form-data.mock';

const TOTAL_ICONS = 5;
const PARTIAL_ICONS = 3;

describe('PasswordIndicator', () => {
  it('returns null when password is empty', () => {
    const { container } = render(<PasswordIndicator password="" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders correct password rules with invalid icons for invalid password', () => {
    render(<PasswordIndicator password={mockInvalidPassword} />);

    expect(screen.getByText('One uppercase letter')).toBeInTheDocument();
    expect(screen.getByText('One lowercase letter')).toBeInTheDocument();
    expect(screen.getByText('One special character')).toBeInTheDocument();

    const invalidIcons = screen.getAllByText('✗');
    expect(invalidIcons).toHaveLength(PARTIAL_ICONS);
  });

  it('shows all valid icons for valid password', () => {
    render(<PasswordIndicator password={mockValidPassword} />);

    const validIcons = screen.getAllByText('✓');
    expect(validIcons).toHaveLength(TOTAL_ICONS);
  });

  it('shows mix of valid and invalid icons for partial password', () => {
    render(<PasswordIndicator password="Password" />);

    const validIcons = screen.getAllByText('✓');
    const invalidIcons = screen.getAllByText('✗');

    expect(validIcons.length).toBeGreaterThan(0);
    expect(invalidIcons.length).toBeGreaterThan(0);
    expect(validIcons.length + invalidIcons.length).toBe(TOTAL_ICONS);
  });
});
