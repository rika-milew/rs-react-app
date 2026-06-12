import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UncontrolledForm } from './uncontrolled-form';

import { mockFormData1 } from '@/test-utils/form-data.mock';

const mockSaveSubmission = vi.fn();

type StoreState = {
  saveSubmission: typeof mockSaveSubmission;
};

vi.mock('@/store/use-form-data-store', () => ({
  useFormDataStore: vi.fn((selector: (state: StoreState) => unknown) => {
    const state: StoreState = {
      saveSubmission: mockSaveSubmission,
    };
    return selector(state);
  }),
}));

vi.mock('@/utils/convert-image', () => ({
  convertImage: vi.fn(() => Promise.resolve('converted-image')),
}));

vi.mock('@/schemas/validation-schemas', () => ({
  validationSchema: {
    validate: vi.fn(),
  },
}));

vi.mock('@/utils/form-data-helpers', () => ({
  getString: vi.fn((formData: FormData, key: string): string => {
    const value = formData.get(key);
    return typeof value === 'string' ? value : '';
  }),
  getNumber: vi.fn((formData: FormData, key: string): number | undefined => {
    const value = formData.get(key);
    if (typeof value === 'string' && value.trim() !== '') {
      const number = Number(value);
      return Number.isNaN(number) ? undefined : number;
    }
    return undefined;
  }),
}));

vi.mock(
  '../form-fields/uncontrolled-form-fields/uncontrolled-form-fields',
  () => ({
    UncontrolledFormFields: vi.fn(() => <div data-testid="form-fields" />),
  }),
);

vi.mock('@/components/button/button', () => ({
  Button: vi.fn(({ text }: { text: string }) => (
    <button type="submit">{text}</button>
  )),
}));

describe('UncontrolledForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form with fields and submit button', () => {
    render(<UncontrolledForm onSuccess={vi.fn()} />);

    expect(screen.getByTestId('form-fields')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  it('submits valid form and calls onSuccess', async () => {
    const handleSuccess = vi.fn();
    const user = userEvent.setup();
    const { validationSchema } = await import('@/schemas/validation-schemas');

    const validData = {
      ...mockFormData1,
      image: new File(['test'], 'test.png', { type: 'image/png' }),
    };

    vi.spyOn(validationSchema, 'validate').mockResolvedValue(validData);

    render(<UncontrolledForm onSuccess={handleSuccess} />);

    await user.click(screen.getByText('Submit'));

    expect(mockSaveSubmission).toHaveBeenCalledWith({
      ...mockFormData1,
      image: 'converted-image',
    });
    expect(handleSuccess).toHaveBeenCalledTimes(1);
  });

  it('displays validation errors', async () => {
    const user = userEvent.setup();
    const { ValidationError } = await import('yup');
    const { validationSchema } = await import('@/schemas/validation-schemas');

    const validationError = new ValidationError('Validation failed');
    validationError.inner = [
      new ValidationError('Name is required', '', 'name'),
      new ValidationError('Email is required', '', 'email'),
    ];

    vi.spyOn(validationSchema, 'validate').mockRejectedValue(validationError);

    render(<UncontrolledForm onSuccess={vi.fn()} />);

    await user.click(screen.getByText('Submit'));

    expect(screen.getByTestId('form-fields')).toBeInTheDocument();
  });
});
