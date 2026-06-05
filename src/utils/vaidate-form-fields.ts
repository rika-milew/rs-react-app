import { COUNTRIES } from '@/constants/constants';

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

export const isFirstLetterUppercase = (value?: string): boolean => {
  if (!value) {
    return false;
  }
  return value.startsWith(value[0].toUpperCase());
};

export const isValidCountry = (value?: string): boolean => {
  return value ? COUNTRIES.includes(value) : false;
};
