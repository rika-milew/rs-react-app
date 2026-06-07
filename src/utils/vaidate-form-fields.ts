import { COUNTRIES } from '@/constants/constants';

type AllowedImageType = 'image/jpeg' | 'image/png';

export const isValidImageType = (type: string): type is AllowedImageType => {
  return type === 'image/jpeg' || type === 'image/png';
};

export const isValidEmail = (email: string): boolean => {
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

export const isFirstLetterUppercase = (value: string): boolean => {
  if (!value) {
    return true;
  }

  const firstChar = value[0];

  if (firstChar.toLowerCase() === firstChar.toUpperCase()) {
    return false;
  }

  if (firstChar !== firstChar.toUpperCase()) {
    return false;
  }

  for (const char of value) {
    if (char === ' ') {
      continue;
    }
    if (char.toLowerCase() === char.toUpperCase()) {
      return false;
    }
  }

  return true;
};

export const isValidCountry = (value?: string): boolean => {
  if (!value) {
    return true;
  }
  return COUNTRIES.includes(value);
};
