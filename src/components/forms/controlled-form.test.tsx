import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ControlledForm } from './controlled-form';
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

vi.mock('./form-fields/controlled-form-fields', () => ({
  ControlledFormFields: vi.fn(() => <div data-testid="form-fields" />),
}));

vi.mock('@/components/button/button', () => ({
  Button: vi.fn(({ text, disabled }: { text: string; disabled?: boolean }) => (
    <button type="submit" disabled={disabled}>
      {text}
    </button>
  )),
}));

function emptyResolver() {
  return { values: {}, errors: {} };
}

function mockYupResolver() {
  return emptyResolver;
}

vi.mock('@hookform/resolvers/yup', () => ({
  yupResolver: vi.fn(mockYupResolver),
}));

vi.mock('@/constants/constants', () => ({
  DEFAULT_FORM_VALUES: {
    name: '',
    age: undefined,
    email: '',
    gender: '',
    terms: false,
    password: '',
    confirmPassword: '',
    image: undefined,
    country: '',
  },
}));

vi.mock('@/schemas/validation-schemas', () => ({
  validationSchema: {},
}));

const mockUseForm = vi.fn(() => ({
  register: vi.fn(),
  handleSubmit: vi.fn((onSubmit: (data: Record<string, unknown>) => void) => {
    return () => {
      onSubmit({
        ...mockFormData1,
        image: new File(['test'], 'test.png', { type: 'image/png' }),
      });
    };
  }),
  reset: vi.fn(),
  setValue: vi.fn(),
  control: {},
  watch: vi.fn(),
  trigger: vi.fn(),
  formState: {
    errors: {},
    isSubmitting: false,
    isValid: true,
  },
}));

vi.mock('react-hook-form', () => ({
  useForm: () => mockUseForm(),
  useWatch: vi.fn(() => ''),
}));

describe('ControlledForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseForm.mockReturnValue({
      register: vi.fn(),
      handleSubmit: vi.fn(
        (onSubmit: (data: Record<string, unknown>) => void) => {
          return () => {
            onSubmit({
              ...mockFormData1,
              image: new File(['test'], 'test.png', { type: 'image/png' }),
            });
          };
        },
      ),
      reset: vi.fn(),
      setValue: vi.fn(),
      control: {},
      watch: vi.fn(),
      trigger: vi.fn(),
      formState: {
        errors: {},
        isSubmitting: false,
        isValid: true,
      },
    });
  });

  it('renders form with fields and submit button correctly', () => {
    render(<ControlledForm onSuccess={vi.fn()} />);

    expect(screen.getByTestId('form-fields')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  it('submits form and calls onSuccess', async () => {
    const handleSuccess = vi.fn();
    const user = userEvent.setup();

    render(<ControlledForm onSuccess={handleSuccess} />);

    await user.click(screen.getByText('Submit'));

    expect(mockSaveSubmission).toHaveBeenCalledWith({
      ...mockFormData1,
      image: 'converted-image',
    });
    expect(handleSuccess).toHaveBeenCalledTimes(1);
  });

  it('disables submit button when form is invalid', () => {
    mockUseForm.mockReturnValue({
      register: vi.fn(),
      handleSubmit: vi.fn(),
      reset: vi.fn(),
      setValue: vi.fn(),
      control: {},
      watch: vi.fn(),
      trigger: vi.fn(),
      formState: {
        errors: {},
        isSubmitting: false,
        isValid: false,
      },
    });

    render(<ControlledForm onSuccess={vi.fn()} />);

    expect(screen.getByText('Submit')).toBeDisabled();
  });

  it('disables submit button while submitting', () => {
    mockUseForm.mockReturnValue({
      register: vi.fn(),
      handleSubmit: vi.fn(),
      reset: vi.fn(),
      setValue: vi.fn(),
      control: {},
      watch: vi.fn(),
      trigger: vi.fn(),
      formState: {
        errors: {},
        isSubmitting: true,
        isValid: true,
      },
    });

    render(<ControlledForm onSuccess={vi.fn()} />);

    expect(screen.getByText('Submit')).toBeDisabled();
  });
});
