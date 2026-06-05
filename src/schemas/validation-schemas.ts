import { object, string, number, boolean, ref, mixed } from 'yup';
import { PASSWORD_VALIDATION, IMAGE_VALIDATION } from '@/constants/constants';

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
      'First letter must be uppercase',
      isFirstLetterUppercase,
    ),

  age: number().required('Age is required').min(0, 'Age cannot be negative'),

  gender: string()
    .required('Gender is required')
    .oneOf(['male', 'female'], 'Invalid gender'),

  email: string()
    .required('Email is required')
    .test(
      'email',
      'Invalid email format',
      (value) => !!value && isValidEmail(value),
    ),

  terms: boolean()
    .required('Please accept the Terms and Conditions')
    .oneOf([true], 'You need to agree to the Terms to continue'),

  password: string()
    .required('Password is required')
    .min(PASSWORD_VALIDATION.MIN_LENGTH, 'At least 6 characters')
    .matches(
      PASSWORD_VALIDATION.PATTERNS.uppercaseLetters,
      PASSWORD_VALIDATION.ERROR_MESSAGES.uppercaseLetters,
    )
    .matches(
      PASSWORD_VALIDATION.PATTERNS.lowercaseLetters,
      PASSWORD_VALIDATION.ERROR_MESSAGES.lowercaseLetters,
    )
    .matches(
      PASSWORD_VALIDATION.PATTERNS.numbers,
      PASSWORD_VALIDATION.ERROR_MESSAGES.numbers,
    )
    .matches(
      PASSWORD_VALIDATION.PATTERNS.specialCharacters,
      PASSWORD_VALIDATION.ERROR_MESSAGES.specialCharacters,
    ),

  confirmPassword: string()
    .required('Confirm password')
    .oneOf([ref('password')], 'Passwords do not match'),

  image: mixed<File>()
    .required('Image is required')
    .test('fileType', 'Only PNG and JPEG images are allowed', (file) => {
      return isValidFile(file) && isValidImageType(file.type);
    })
    .test('fileSize', 'Image size must be less than 2 MB', (file) => {
      return isValidFile(file) && file.size <= IMAGE_VALIDATION.MAX_SIZE_BYTES;
    }),

  country: string()
    .required('Country is required')
    .test('valid-country', 'Please select a valid country', isValidCountry),
});
