import { create } from "zustand";

interface PlayerStore {
  ids: string[];
  activeId?: string;
  setId: (id: string) => void;
  setIds: (ids: string[]) => void;
  playNext: () => void;
  playPrevious: () => void;
  reset: () => void;
}

const usePlayer = create<PlayerStore>((set, get) => ({
  ids: [],
  activeId: undefined,

  setId: (id) => set({ activeId: id }),
  setIds: (ids) => set({ ids }),

  playNext: () => {
    const { ids, activeId } = get();
    if (!activeId) return;
    const currentIndex = ids.findIndex((id) => id === activeId);
    const nextId = ids[currentIndex + 1];
    if (nextId) set({ activeId: nextId });
  },

  playPrevious: () => {
    const { ids, activeId } = get();
    if (!activeId) return;
    const currentIndex = ids.findIndex((id) => id === activeId);
    const prevId = ids[currentIndex - 1];
    if (prevId) set({ activeId: prevId });
  },

  reset: () => set({ ids: [], activeId: undefined }),
}));

export default usePlayer;
