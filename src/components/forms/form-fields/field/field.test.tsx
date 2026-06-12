import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Field } from './field';

describe('Field', () => {
  it('renders label and children in default order', () => {
    render(
      <Field id="test" label="Test Label">
        <input data-testid="test-input" />
      </Field>,
    );

    const label = screen.getByText('Test Label');
    const input = screen.getByTestId('test-input');

    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(label.compareDocumentPosition(input)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  it('renders label and children in reverse order', () => {
    render(
      <Field id="test" label="Test Label" reverse>
        <input data-testid="test-input" />
      </Field>,
    );

    const label = screen.getByText('Test Label');
    const input = screen.getByTestId('test-input');

    expect(input.compareDocumentPosition(label)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  it('shows error message when error prop is provided', () => {
    render(
      <Field id="test" label="Test Label" error="Error message">
        <input />
      </Field>,
    );

    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('does not show error message when no error provided', () => {
    render(
      <Field id="test" label="Test Label">
        <input />
      </Field>,
    );

    expect(screen.queryByText('Error message')).not.toBeInTheDocument();
  });

  it('binds label with input via htmlFor', () => {
    render(
      <Field id="test-id" label="Test Label">
        <input data-testid="test-input" />
      </Field>,
    );

    const label = screen.getByText('Test Label');
    expect(label).toHaveAttribute('for', 'test-id');
  });
});
