import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { UncontrolledFormFields } from './uncontrolled-form-fields';

vi.mock('@/components/country-autocomplete/country-autocomplete', () => ({
  CountryAutocomplete: vi.fn(({ name }: { name: string }) => (
    <input data-testid={`country-${name}`} id={name} name={name} />
  )),
}));

vi.mock('../image-upload/image-upload', () => ({
  ImageUpload: vi.fn(({ name }: { name: string }) => (
    <input data-testid={`image-${name}`} type="file" name={name} />
  )),
}));

vi.mock('@/components/password-indicator/password-indicator', () => ({
  PasswordIndicator: vi.fn(({ password }: { password: string }) => (
    <div data-testid="password-indicator">{password}</div>
  )),
}));

vi.mock('@/constants/constants', () => ({
  GENDER_OPTIONS: [
    { value: 'female', label: 'Female' },
    { value: 'male', label: 'Male' },
  ],
}));

describe('UncontrolledFormFields', () => {
  it('renders all form fields correctly', () => {
    render(<UncontrolledFormFields />);

    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Age')).toBeInTheDocument();
    expect(screen.getByLabelText('Gender')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Country')).toBeInTheDocument();
    expect(
      screen.getByLabelText('Accept Terms & Conditions'),
    ).toBeInTheDocument();
  });

  it('renders gender options correctly', () => {
    render(<UncontrolledFormFields />);

    expect(screen.getByText('Select gender')).toBeInTheDocument();
    expect(screen.getByText('Female')).toBeInTheDocument();
    expect(screen.getByText('Male')).toBeInTheDocument();
  });

  it('shows password in password indicator', async () => {
    const user = userEvent.setup();
    render(<UncontrolledFormFields />);

    const passwordInput = screen.getByLabelText('Password');
    await user.type(passwordInput, 'password123');

    expect(screen.getByTestId('password-indicator')).toHaveTextContent(
      'password123',
    );
  });

  it('renders image upload field', () => {
    render(<UncontrolledFormFields />);
    expect(screen.getByTestId('image-image')).toBeInTheDocument();
  });

  it('renders country autocomplete', () => {
    render(<UncontrolledFormFields />);
    expect(screen.getByTestId('country-country')).toBeInTheDocument();
  });

  it('shows error messages when provided', () => {
    const errors = {
      name: 'Name error',
      terms: 'Terms error',
    };

    render(<UncontrolledFormFields errors={errors} />);

    expect(screen.getByText('Name error')).toBeInTheDocument();
    expect(screen.getByText('Terms error')).toBeInTheDocument();
  });

  it('does not show error messages when not provided', () => {
    render(<UncontrolledFormFields />);

    expect(screen.queryByText('Name error')).not.toBeInTheDocument();
  });
});
