export const ANIMATION_DURATION = 3000;

export const DEFAULT_FORM_VALUES = {
  name: '',
  age: undefined,
  email: '',
  gender: '',
  terms: false,
  password: '',
  confirmPassword: '',
  image: undefined,
  country: '',
} as const;

export const GENDER_OPTIONS = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
] as const;

export const COUNTRIES: string[] = [
  'Belarus',
  'Poland',
  'Ukraine',
  'Russia',
  'Switzerland',
  'Austria',
  'Belgium',
  'Denmark',
  'Finland',
  'Ireland',
  'Portugal',
  'Greece',
  'Czech Republic',
  'Hungary',
  'Romania',
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Japan',
  'Brazil',
  'India',
  'Italy',
  'Spain',
  'Mexico',
  'Netherlands',
  'Sweden',
  'Norway',
  'China',
  'South Korea',
  'Indonesia',
  'Turkey',
  'Saudi Arabia',
  'Israel',
  'Singapore',
  'Thailand',
  'Vietnam',
  'Argentina',
  'Chile',
  'Colombia',
  'Egypt',
  'Kenya',
  'New Zealand',
  'Nigeria',
  'South Africa',
  'UAE',
] as const;

export const PASSWORD_VALIDATION = {
  MIN_LENGTH: 6,
  TOTAL_RULES: 5,
  PATTERNS: {
    uppercaseLetters: /[A-Z]/,
    lowercaseLetters: /[a-z]/,
    numbers: /[0-9]/,
    specialCharacters: /[!@#$%^&*(),.?":{}|<>]/,
  },
  ERROR_MESSAGES: {
    length: 'At least 6 characters',
    uppercaseLetters: 'One uppercase letter',
    lowercaseLetters: 'One lowercase letter',
    numbers: 'One number',
    specialCharacters: 'One special character',
  },
} as const;

export const PASSWORD_RULES_CONFIG = [
  {
    key: 'length',
    text: PASSWORD_VALIDATION.ERROR_MESSAGES.length,
    check: (password: string): boolean =>
      password.length >= PASSWORD_VALIDATION.MIN_LENGTH,
  },
  {
    key: 'uppercase',
    text: PASSWORD_VALIDATION.ERROR_MESSAGES.uppercaseLetters,
    check: (password: string): boolean =>
      PASSWORD_VALIDATION.PATTERNS.uppercaseLetters.test(password),
  },
  {
    key: 'lowercase',
    text: PASSWORD_VALIDATION.ERROR_MESSAGES.lowercaseLetters,
    check: (password: string): boolean =>
      PASSWORD_VALIDATION.PATTERNS.lowercaseLetters.test(password),
  },
  {
    key: 'number',
    text: PASSWORD_VALIDATION.ERROR_MESSAGES.numbers,
    check: (password: string): boolean =>
      PASSWORD_VALIDATION.PATTERNS.numbers.test(password),
  },
  {
    key: 'special',
    text: PASSWORD_VALIDATION.ERROR_MESSAGES.specialCharacters,
    check: (password: string): boolean =>
      PASSWORD_VALIDATION.PATTERNS.specialCharacters.test(password),
  },
] as const;

export const BYTES = 1024;

export const IMAGE_VALIDATION = {
  ALLOWED_TYPES: ['image/jpeg', 'image/png'] as const,
  MAX_SIZE_MB: 2,
  get MAX_SIZE_BYTES() {
    return this.MAX_SIZE_MB * BYTES * BYTES;
  },
} as const;
