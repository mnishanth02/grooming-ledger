import { create } from "zustand";

interface useTeamModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useTeamModal = create<useTeamModalProps>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
