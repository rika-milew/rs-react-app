import { create } from 'zustand';
import type { FormFields } from '@/types/form-types';

type FormDataStore = {
  submissions: FormFields[];

  saveSubmission: (data: Omit<FormFields, 'id' | 'createdAt'>) => void;
};

export const useFormDataStore = create<FormDataStore>((set) => ({
  submissions: [],

  saveSubmission: (data): void => {
    const newSubmission: FormFields = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };

    set((state) => ({
      submissions: [newSubmission].concat(state.submissions),
    }));
  },
}));
