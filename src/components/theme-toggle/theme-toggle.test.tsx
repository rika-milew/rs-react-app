import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { ThemeToggle } from './theme-toggle';

const { toggleThemeMock, currentTheme } = vi.hoisted(() => ({
  toggleThemeMock: vi.fn(),
  currentTheme: { value: 'dark' },
}));

vi.mock('@/theme-context/theme-context', () => ({
  useTheme: () => ({
    theme: currentTheme.value,
    toggleTheme: toggleThemeMock,
  }),
}));

vi.mock('@/assets/icons', () => ({
  SunIcon: ({ className }: { className: string }) => (
    <span className={className} data-testid="light-theme-icon">
      ☀️
    </span>
  ),
  MoonIcon: ({ className }: { className: string }) => (
    <span className={className} data-testid="dark-theme-icon">
      🌙
    </span>
  ),
}));

describe('ThemeToggle component', () => {
  beforeEach(() => {
    toggleThemeMock.mockClear();
    currentTheme.value = 'dark';
  });

  it('renders icon components', () => {
    render(<ThemeToggle />);

    expect(screen.getByTestId('light-theme-icon')).toBeInTheDocument();
    expect(screen.getByTestId('dark-theme-icon')).toBeInTheDocument();
  });

  it('toggles theme when button is clicked', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    const button = screen.getByRole('button', {
      name: /switch to the light mode/i,
    });
    await user.click(button);

    expect(toggleThemeMock).toHaveBeenCalledTimes(1);
  });

  it('shows correct aria label for dark theme', () => {
    render(<ThemeToggle />);

    expect(
      screen.getByRole('button', { name: /switch to the light mode/i }),
    ).toBeInTheDocument();
  });

  it('shows correct aria label for light theme', () => {
    currentTheme.value = 'light';
    render(<ThemeToggle />);

    expect(
      screen.getByRole('button', { name: /switch to the dark mode/i }),
    ).toBeInTheDocument();
  });
});
