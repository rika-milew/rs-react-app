import { describe, it, expect, vi } from 'vitest';
import { validationSchema } from './validation-schemas';
import {
  mockFormData1,
  mockInvalidPassword,
  mockInvalidImageFile,
  mockValidPassword,
} from '@/test-utils/form-data.mock';

const mockedConstants = vi.hoisted(() => ({
  PASSWORD_MIN_LENGTH: 6,
  IMAGE_MAX_SIZE: 2_097_052,
}));

vi.mock('@/constants/constants', () => ({
  PASSWORD_RULES_CONFIG: [
    {
      check: (value: string): boolean =>
        value.length >= mockedConstants.PASSWORD_MIN_LENGTH,
    },
    { check: (value: string): boolean => /[A-Z]/.test(value) },
    { check: (value: string): boolean => /[a-z]/.test(value) },
    { check: (value: string): boolean => /[0-9]/.test(value) },
    { check: (value: string): boolean => /[!@#$%^&*(),.?":{}|<>]/.test(value) },
  ],
  IMAGE_VALIDATION: {
    ALLOWED_TYPES: ['image/jpeg', 'image/png'],
    MAX_SIZE_BYTES: mockedConstants.IMAGE_MAX_SIZE,
  },
  COUNTRIES: ['Belarus', 'Russia', 'Poland'],
}));

describe('validationSchema', () => {
  it('validates correct form data', async () => {
    await expect(
      validationSchema.validate(mockFormData1),
    ).resolves.toBeTruthy();
  });

  describe('name validation', () => {
    it('requires name', async () => {
      await expect(
        validationSchema.validateAt('name', {
          ...mockFormData1,
          name: '',
        }),
      ).rejects.toThrow('Name is required');
    });

    it('rejects name starting with lowercase', async () => {
      await expect(
        validationSchema.validateAt('name', {
          ...mockFormData1,
          name: 'erika',
        }),
      ).rejects.toThrow(
        'Name should contain only letters and start with uppercase',
      );
    });

    it('rejects name with numbers', async () => {
      await expect(
        validationSchema.validateAt('name', {
          ...mockFormData1,
          name: 'Erika123',
        }),
      ).rejects.toThrow(
        'Name should contain only letters and start with uppercase',
      );
    });

    it('accepts valid name with spaces', async () => {
      await expect(
        validationSchema.validateAt('name', {
          ...mockFormData1,
          name: 'Erika Mileuskaya',
        }),
      ).resolves.toBeTruthy();
    });

    it('accepts name starting with uppercase', async () => {
      await expect(
        validationSchema.validateAt('name', {
          ...mockFormData1,
          name: 'Erika',
        }),
      ).resolves.toBeTruthy();
    });
  });

  describe('age validation', () => {
    it('requires age', async () => {
      await expect(
        validationSchema.validateAt('age', {
          ...mockFormData1,
          age: undefined,
        }),
      ).rejects.toThrow('Age is required');
    });

    it('rejects negative age', async () => {
      await expect(
        validationSchema.validateAt('age', {
          ...mockFormData1,
          age: -100,
        }),
      ).rejects.toThrow('Age cannot be negative');
    });

    it('rejects non-number age', async () => {
      await expect(
        validationSchema.validateAt('age', {
          ...mockFormData1,
          age: 'twenty' as unknown as number,
        }),
      ).rejects.toThrow('Age must be a number');
    });

    it('accepts zero age', async () => {
      await expect(
        validationSchema.validateAt('age', {
          ...mockFormData1,
          age: 0,
        }),
      ).resolves.toBe(0);
    });
  });

  describe('gender validation', () => {
    it('requires gender', async () => {
      await expect(
        validationSchema.validateAt('gender', {
          ...mockFormData1,
          gender: '',
        }),
      ).rejects.toThrow('Gender is required');
    });

    it('accepts male gender', async () => {
      await expect(
        validationSchema.validateAt('gender', {
          ...mockFormData1,
          gender: 'male',
        }),
      ).resolves.toBeTruthy();
    });

    it('accepts female gender', async () => {
      await expect(
        validationSchema.validateAt('gender', {
          ...mockFormData1,
          gender: 'female',
        }),
      ).resolves.toBeTruthy();
    });

    it('rejects invalid gender', async () => {
      await expect(
        validationSchema.validateAt('gender', {
          ...mockFormData1,
          gender: 'other',
        }),
      ).rejects.toThrow('Gender is required');
    });
  });

  describe('email validation', () => {
    it('requires email', async () => {
      await expect(
        validationSchema.validateAt('email', {
          ...mockFormData1,
          email: '',
        }),
      ).rejects.toThrow('Email is required');
    });

    it('rejects email without @', async () => {
      await expect(
        validationSchema.validateAt('email', {
          ...mockFormData1,
          email: 'test-email',
        }),
      ).rejects.toThrow('Invalid email format');
    });

    it('rejects email with empty domain', async () => {
      await expect(
        validationSchema.validateAt('email', {
          ...mockFormData1,
          email: 'test@',
        }),
      ).rejects.toThrow('Invalid email format');
    });

    it('rejects email starting with dot in domain', async () => {
      await expect(
        validationSchema.validateAt('email', {
          ...mockFormData1,
          email: 'test@.example.com',
        }),
      ).rejects.toThrow('Invalid email format');
    });

    it('accepts valid email', async () => {
      await expect(
        validationSchema.validateAt('email', {
          ...mockFormData1,
          email: 'test@example.com',
        }),
      ).resolves.toBeTruthy();
    });
  });

  describe('terms validation', () => {
    it('requires terms acceptance', async () => {
      await expect(
        validationSchema.validateAt('terms', {
          ...mockFormData1,
          terms: false,
        }),
      ).rejects.toThrow('You need to agree to the Terms to continue');
    });

    it('accepts true terms', async () => {
      await expect(
        validationSchema.validateAt('terms', {
          ...mockFormData1,
          terms: true,
        }),
      ).resolves.toBeTruthy();
    });
  });

  describe('password validation', () => {
    it('requires password', async () => {
      await expect(
        validationSchema.validateAt('password', {
          ...mockFormData1,
          password: '',
        }),
      ).rejects.toThrow('Password is required');
    });

    it('rejects weak password', async () => {
      await expect(
        validationSchema.validateAt('password', {
          ...mockFormData1,
          password: mockInvalidPassword,
        }),
      ).rejects.toThrow('');
    });

    it('accepts strong password', async () => {
      await expect(
        validationSchema.validateAt('password', {
          ...mockFormData1,
          password: mockValidPassword,
        }),
      ).resolves.toBeTruthy();
    });
  });

  describe('confirmPassword validation', () => {
    it('requires confirm password', async () => {
      await expect(
        validationSchema.validateAt('confirmPassword', {
          ...mockFormData1,
          confirmPassword: '',
        }),
      ).rejects.toThrow('Passwords do not match');
    });

    it('rejects mismatched passwords', async () => {
      await expect(
        validationSchema.validateAt('confirmPassword', {
          ...mockFormData1,
          confirmPassword: 'password3224@A',
        }),
      ).rejects.toThrow('Passwords do not match');
    });

    it('accepts matching passwords', async () => {
      await expect(
        validationSchema.validateAt('confirmPassword', {
          ...mockFormData1,
          password: mockValidPassword,
          confirmPassword: mockValidPassword,
        }),
      ).resolves.toBeTruthy();
    });
  });

  describe('image validation', () => {
    it('requires image', async () => {
      await expect(
        validationSchema.validateAt('image', {
          ...mockFormData1,
          image: undefined,
        }),
      ).rejects.toThrow('Image is required');
    });

    it('rejects invalid image type', async () => {
      await expect(
        validationSchema.validateAt('image', {
          ...mockFormData1,
          image: mockInvalidImageFile,
        }),
      ).rejects.toThrow('Upload PNG or JPEG image');
    });

    it('accepts PNG image', async () => {
      const pngFile = new File(['test'], 'test.png', { type: 'image/png' });
      await expect(
        validationSchema.validateAt('image', {
          ...mockFormData1,
          image: pngFile,
        }),
      ).resolves.toBeTruthy();
    });

    it('accepts JPEG image', async () => {
      const jpegFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      await expect(
        validationSchema.validateAt('image', {
          ...mockFormData1,
          image: jpegFile,
        }),
      ).resolves.toBeTruthy();
    });
  });

  describe('country validation', () => {
    it('requires country', async () => {
      await expect(
        validationSchema.validateAt('country', {
          ...mockFormData1,
          country: '',
        }),
      ).rejects.toThrow('Country is required');
    });

    it('rejects invalid country', async () => {
      await expect(
        validationSchema.validateAt('country', {
          ...mockFormData1,
          country: 'Unknown',
        }),
      ).rejects.toThrow('Please select a valid country');
    });

    it('accepts valid country from list', async () => {
      await expect(
        validationSchema.validateAt('country', {
          ...mockFormData1,
          country: 'Belarus',
        }),
      ).resolves.toBeTruthy();
    });

    it('accepts other valid countries', async () => {
      await expect(
        validationSchema.validateAt('country', {
          ...mockFormData1,
          country: 'Poland',
        }),
      ).resolves.toBeTruthy();
    });
  });
});
