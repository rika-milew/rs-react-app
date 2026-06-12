import { create } from 'zustand';

export type FormType = 'uncontrolled' | 'controlled';

type ModalStore = {
  isModalVisible: boolean;
  formType: FormType | null;
  openModal: (type: FormType) => void;
  closeModal: () => void;
};

export const useModalStore = create<ModalStore>((set) => ({
  isModalVisible: false,
  formType: null,
  openModal: (type): void => set({ isModalVisible: true, formType: type }),
  closeModal: (): void => set({ isModalVisible: false, formType: null }),
}));
