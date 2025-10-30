import { create } from "zustand"
export const useSidebarStore = create<{ open: boolean; toggle: () => void }>((set) => ({
    open: true,
    toggle: () => set((s) => ({ open: !s.open })),
}))