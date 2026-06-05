import { IMAGE_VALIDATION } from '@/constants/constants';

type AllowedImageType = 'image/jpeg' | 'image/png';

type ValidationResult = {
  isValid: boolean;
  error?: string;
};

export const isValidImageType = (type: string): type is AllowedImageType => {
  return type === 'image/jpeg' || type === 'image/png';
};

export const isValidFile = (value: unknown): value is File =>
  value instanceof File;

export const validateImage = (file: File): ValidationResult => {
  if (!isValidImageType(file.type)) {
    return {
      isValid: false,
      error: 'Only PNG and JPEG image formats are allowed',
    };
  }

  if (file.size > IMAGE_VALIDATION.MAX_SIZE_BYTES) {
    return {
      isValid: false,
      error: 'Image size should be less than 2MB',
    };
  }
  return { isValid: true };
};

export const convertImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener('load', () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert image to base64'));
      }
    });

    reader.addEventListener('error', () => {
      reject(reader.error ?? new Error('Unknown error'));
    });

    reader.readAsDataURL(file);
  });
};
