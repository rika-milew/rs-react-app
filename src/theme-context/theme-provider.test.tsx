import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from './theme-provider';
import { useContext } from 'react';
import { ThemeContext } from './theme-context';

const TestComponent = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('ThemeContext error');
  }

  const { theme, toggleTheme } = context;

  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
};

describe('ThemeProvider component', () => {
  beforeEach(() => {
    delete document.documentElement.dataset.theme;
  });

  it('renders with dark theme by default', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme').textContent).toBe('dark');
  });

  it('toggles theme from dark to light correctly', async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme').textContent).toBe('dark');
    await user.click(screen.getByText('Toggle'));

    expect(screen.getByTestId('theme').textContent).toBe('light');
    expect(document.documentElement.dataset.theme).toBe('light');
  });

  it('toggles theme from light to dark correctly', async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider defaultTheme="light">
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme').textContent).toBe('light');
    await user.click(screen.getByText('Toggle'));

    expect(screen.getByTestId('theme').textContent).toBe('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('sets data-theme attribute on document element correctly', () => {
    render(
      <ThemeProvider>
        <div>Content</div>
      </ThemeProvider>
    );

    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('sets theme to light when default theme is light', () => {
    render(
      <ThemeProvider defaultTheme="light">
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme').textContent).toBe('light');
    expect(document.documentElement.dataset.theme).toBe('light');
  });

  it('toggles theme multiple times correctly', async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const button = screen.getByText('Toggle');

    await user.click(button);
    expect(screen.getByTestId('theme').textContent).toBe('light');

    await user.click(button);
    expect(screen.getByTestId('theme').textContent).toBe('dark');

    await user.click(button);
    expect(screen.getByTestId('theme').textContent).toBe('light');
  });

  it('renders children components correctly', () => {
    render(
      <ThemeProvider>
        <div data-testid="child">Content</div>
      </ThemeProvider>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
