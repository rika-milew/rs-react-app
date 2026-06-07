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
