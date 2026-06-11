import { describe, it, expect, vi } from 'vitest';
import {
  isValidCountry,
  isValidEmail,
  isValidImageType,
  isValidNameFormat,
} from './validate-form-fields';

vi.mock('@/constants/constants', () => ({
  COUNTRIES: ['Belarus', 'Russia', 'Poland'],
}));

describe('isValidImageType', () => {
  it('returns true for image/jpeg', () => {
    expect(isValidImageType('image/jpeg')).toBe(true);
  });

  it('returns true for image/png', () => {
    expect(isValidImageType('image/png')).toBe(true);
  });

  it('returns false for other file types', () => {
    expect(isValidImageType('image/webp')).toBe(false);
    expect(isValidImageType('application/pdf')).toBe(false);
  });
});

describe('isValidEmail', () => {
  it('returns false for empty string', () => {
    expect(isValidEmail('')).toBe(false);
  });

  it('returns false when @ is missing', () => {
    expect(isValidEmail('test.example.com')).toBe(false);
  });

  it('returns false when local part is empty', () => {
    expect(isValidEmail('@example.com')).toBe(false);
  });

  it('returns false when domain part is empty', () => {
    expect(isValidEmail('test@')).toBe(false);
  });

  it('returns false when domain starts with dot', () => {
    expect(isValidEmail('test@.example.com')).toBe(false);
  });

  it('returns false when domain has no dot', () => {
    expect(isValidEmail('test@example')).toBe(false);
  });

  it('returns false when dot is last char in domain', () => {
    expect(isValidEmail('test@example.')).toBe(false);
  });

  it('returns true for valid email', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
  });
});

describe('isValidNameFormat', () => {
  it('returns true for empty string', () => {
    expect(isValidNameFormat('')).toBe(true);
  });

  it('returns false when first character is not a letter', () => {
    expect(isValidNameFormat('123Erika')).toBe(false);
    expect(isValidNameFormat('.test')).toBe(false);
  });

  it('returns false when first letter is lowercase', () => {
    expect(isValidNameFormat('erika')).toBe(false);
  });

  it('returns false when string contains non-letter characters besides spaces', () => {
    expect(isValidNameFormat('Erika123')).toBe(false);
    expect(isValidNameFormat('Erik.a')).toBe(false);
  });

  it('returns true for valid uppercase first letter with only letters and spaces', () => {
    expect(isValidNameFormat('Erika')).toBe(true);
    expect(isValidNameFormat('Erika Mileuskaya')).toBe(true);
  });
});

describe('isValidCountry', () => {
  it('returns true for empty value', () => {
    expect(isValidCountry('')).toBe(true);
    expect(isValidCountry(undefined)).toBe(true);
  });

  it('returns true for country in the list', () => {
    expect(isValidCountry('Belarus')).toBe(true);
    expect(isValidCountry('Poland')).toBe(true);
  });

  it('returns false for country not in the list', () => {
    expect(isValidCountry('Japan')).toBe(false);
  });
});
