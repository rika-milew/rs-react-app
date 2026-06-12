export type FormFields = FormValues & {
  id: string;
  createdAt: number;
};

export type FormValues = {
  name: string;
  age: number;
  email: string;
  gender: string;
  terms: boolean;
  password: string;
  confirmPassword: string;
  country: string;
  image: File;
};

export type StoredFormData = Omit<FormValues, 'image'> & {
  image: string | null;
  id: string;
  createdAt: number;
};
