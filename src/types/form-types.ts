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
};
