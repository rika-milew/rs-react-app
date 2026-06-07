const LARGE_IMAGE_MULTIPLIER = 3;
const BYTES = 1024;

export const mockUUID = '154e48765-e89b-12d3-a456-887514175432';
export const mockUUID2 = '254e48765-e89b-12d3-a456-887514175432';
export const mockTimestamp = new Date('2026-06-07').getTime();

export const mockFormData1 = {
  name: 'Erika',
  age: 25,
  email: 'test@example.com',
  gender: 'female',
  terms: true,
  password: 'Password123@',
  confirmPassword: 'Password123@',
  country: 'Belarus',
  image: 'base64string1',
};

export const mockFormData2 = {
  name: 'Svyatoslav',
  age: 18,
  email: 'svyat@example.com',
  gender: 'male',
  terms: true,
  password: 'test123',
  confirmPassword: 'test123',
  country: 'Poland',
  image: 'base64string2',
};

export const mockFormData3 = {
  name: 'Kate',
  age: 28,
  email: 'kate@example.com',
  gender: 'female',
  terms: true,
  password: 'test1234',
  confirmPassword: 'test1234',
  country: 'Russia',
  image: 'base64string3',
};

export const mockValidImageFile = new File(['test'], 'test.png', {
  type: 'image/png',
});
export const mockInvalidImageFile = new File(['test'], 'test.webp', {
  type: 'image/webp',
});
export const mockLargeImageFile = new File(
  ['x'.repeat(LARGE_IMAGE_MULTIPLIER * BYTES * BYTES)],
  'large.png',
  { type: 'image/png' },
);

export const mockValidPassword = 'Password123!';
export const mockInvalidPassword = 'password';
