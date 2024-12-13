import { create } from "zustand";

type confettiStore = {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export const useConfettiStore = create<confettiStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}))