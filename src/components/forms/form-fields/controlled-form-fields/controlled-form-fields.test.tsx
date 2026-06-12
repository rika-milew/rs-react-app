import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ControlledFormFields } from './controlled-form-fields';
import type { FieldErrors, UseFormWatch } from 'react-hook-form';
import type { FormValues } from '@/types/form-types';

const register = vi.fn();
const setValue = vi.fn();

const watch: UseFormWatch<FormValues> = vi.fn();

const trigger = vi.fn(() => Promise.resolve(true));

vi.mock('@/components/country-autocomplete/country-autocomplete', () => ({
  CountryAutocomplete: vi.fn(({ name }: { name: string }) => (
    <input data-testid="country-input" id={name} />
  )),
}));

vi.mock('../image-upload/image-upload', () => ({
  ImageUpload: vi.fn(() => <input data-testid="image-upload" type="file" />),
}));

vi.mock('@/components/password-indicator/password-indicator', () => ({
  PasswordIndicator: vi.fn(() => <div data-testid="password-indicator" />),
}));

vi.mock('@/constants/constants', () => ({
  GENDER_OPTIONS: [
    { value: 'female', label: 'Female' },
    { value: 'male', label: 'Male' },
  ],
}));

const emptyErrors: FieldErrors<FormValues> = {};

describe('ControlledFormFields', () => {
  it('renders all form fields correctly', () => {
    render(
      <ControlledFormFields
        register={register}
        errors={emptyErrors}
        setValue={setValue}
        watch={watch}
        trigger={trigger}
      />,
    );

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
    render(
      <ControlledFormFields
        register={register}
        errors={emptyErrors}
        setValue={setValue}
        watch={watch}
        trigger={trigger}
      />,
    );

    expect(screen.getByText('Select gender')).toBeInTheDocument();
    expect(screen.getByText('Female')).toBeInTheDocument();
    expect(screen.getByText('Male')).toBeInTheDocument();
  });

  it('displays error messages', () => {
    const errors: FieldErrors<FormValues> = {
      name: { message: 'Name is required', type: 'required' },
      age: { message: 'Age is required', type: 'required' },
    };

    render(
      <ControlledFormFields
        register={register}
        errors={errors}
        setValue={setValue}
        watch={watch}
        trigger={trigger}
      />,
    );

    expect(screen.getByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Age is required')).toBeInTheDocument();
  });

  it('renders password indicator', () => {
    render(
      <ControlledFormFields
        register={register}
        errors={emptyErrors}
        setValue={setValue}
        watch={watch}
        trigger={trigger}
      />,
    );

    expect(screen.getByTestId('password-indicator')).toBeInTheDocument();
  });

  it('renders image upload input', () => {
    render(
      <ControlledFormFields
        register={register}
        errors={emptyErrors}
        setValue={setValue}
        watch={watch}
        trigger={trigger}
      />,
    );

    expect(screen.getByTestId('image-upload')).toBeInTheDocument();
  });

  it('renders country autocomplete component', () => {
    render(
      <ControlledFormFields
        register={register}
        errors={emptyErrors}
        setValue={setValue}
        watch={watch}
        trigger={trigger}
      />,
    );

    expect(screen.getByTestId('country-input')).toBeInTheDocument();
  });
});
