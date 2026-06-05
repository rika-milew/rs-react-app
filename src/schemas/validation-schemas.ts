import { object, string, number, boolean, ref, mixed } from 'yup';
import {
  COUNTRIES,
  PASSWORD_VALIDATION,
  IMAGE_VALIDATION,
} from '@/constants/constants';

import { isValidFile, isValidImageType } from '@/utils/validate-image';

const isValidEmail = (email: string): boolean => {
  if (!email) {
    return false;
  }

  const atIndex = email.indexOf('@');
  if (atIndex === -1) {
    return false;
  }

  const localPart = email.slice(0, atIndex);
  const domainPart = email.slice(atIndex + 1);

  if (localPart.length === 0) {
    return false;
  }
  if (domainPart.length === 0) {
    return false;
  }

  if (domainPart.startsWith('.')) {
    return false;
  }

  const dotIndex = domainPart.lastIndexOf('.');
  if (dotIndex === -1) {
    return false;
  }
  if (dotIndex === domainPart.length - 1) {
    return false;
  }

  return true;
};

const isFirstLetterUppercase = (value?: string): boolean => {
  if (!value) {
    return false;
  }
  return value.startsWith(value[0].toUpperCase());
};

const isValidCountry = (value?: string): boolean => {
  return value ? COUNTRIES.includes(value) : false;
};

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
