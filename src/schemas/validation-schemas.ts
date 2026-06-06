import type { InferType } from 'yup';
import { object, string, number, boolean, ref, mixed } from 'yup';
import { PASSWORD_RULES_CONFIG, IMAGE_VALIDATION } from '@/constants/constants';

import {
  isFirstLetterUppercase,
  isValidEmail,
  isValidCountry,
} from '@/utils/vaidate-form-fields';

import { isValidFile, isValidImageType } from '@/utils/validate-image';

export const validationSchema = object({
  name: string()
    .required('Name is required')
    .test(
      'uppercase',
      'Name should contain only letters and start with uppercase',
      (value) => {
        if (!value) {
          return true;
        }
        return isFirstLetterUppercase(value);
      },
    ),

  age: number()
    .required('Age is required')
    .typeError('Age must be a number')
    .min(0, 'Age cannot be negative'),

  gender: string()
    .required('Gender is required')
    .oneOf(['male', 'female'], 'Gender is required'),

  email: string()
    .required('Email is required')
    .test('email', 'Invalid email format', (value) => {
      if (!value) {
        return true;
      }
      return isValidEmail(value);
    }),

  terms: boolean()
    .required('Please accept the Terms and Conditions')
    .oneOf([true], 'You need to agree to the Terms to continue'),

  password: string()
    .required('Password is required')
    .test('password-strength', '', function (value) {
      if (!value) {
        return true;
      }

      const allValid = PASSWORD_RULES_CONFIG.every((rule) => rule.check(value));
      return allValid;
    }),

  confirmPassword: string()
    .required('Confirm password')
    .oneOf([ref('password')], 'Passwords do not match'),

  image: mixed<File>()
    .required('Image is required')
    .test('fileType', 'Upload PNG or JPEG image', (file) => {
      return isValidFile(file) && isValidImageType(file.type);
    })
    .test('fileSize', 'Image size must be less than 2 MB', (file) => {
      return isValidFile(file) && file.size <= IMAGE_VALIDATION.MAX_SIZE_BYTES;
    }),

  country: string()
    .required('Country is required')
    .test('valid-country', 'Please select a valid country', isValidCountry),
});

export type FormData = InferType<typeof validationSchema>;
