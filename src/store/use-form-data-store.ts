import { create } from 'zustand';
import type { StoredFormData } from '@/types/form-types';

type FormDataStore = {
  submissions: StoredFormData[];
  saveSubmission: (data: Omit<StoredFormData, 'id' | 'createdAt'>) => void;
};

export const useFormDataStore = create<FormDataStore>((set) => ({
  submissions: [],

  saveSubmission: (data): void => {
    const newSubmission: StoredFormData = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };

    set((state) => ({
      submissions: [newSubmission].concat(state.submissions),
    }));
  },
}));
