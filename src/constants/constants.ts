export const ANIMATION_DURATION = 5000;

export const DEFAULT_FORM_VALUES = {
  name: '',
  age: undefined,
  email: '',
  gender: '',
  terms: false,
} as const;

export const GENDER_OPTIONS = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
] as const;
