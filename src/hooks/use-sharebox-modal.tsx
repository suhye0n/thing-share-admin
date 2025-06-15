import { create } from 'zustand';

interface useShareboxModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useShareboxModal = create<useShareboxModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
