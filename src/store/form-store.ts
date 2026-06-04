import { create } from 'zustand';
import type { FormFields } from '@/types/form-types';

type FormDataStore = {
  submissions: FormFields[];

  saveSubmission: (submission: FormFields) => void;
};

export const useFormDataStore = create<FormDataStore>((set) => ({
  submissions: [],

  saveSubmission: (submission: FormFields): void => {
    set((state) => ({
      submissions: state.submissions.concat(submission),
    }));
  },
}));
