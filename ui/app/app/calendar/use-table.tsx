import { create } from "zustand";

interface TableState {
  selected: string[];
  resetSelected: () => void;
  updateSelected: (logId: string) => void;
}

export const useTableStore = create<TableState>()((set) => ({
  selected: [],
  resetSelected: () => {
    set(() => ({ selected: [] }));
  },
  updateSelected: (logId) => {
    set((state) => {
      const selectedSet = new Set(state.selected);

      if (selectedSet.has(logId)) {
        selectedSet.delete(logId);
      } else {
        selectedSet.add(logId);
      }
      return { selected: [...selectedSet] };
    });
  },
}));
