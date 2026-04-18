import { create } from 'zustand';
import { type Memo, type MemoFilter } from '../database/types';
import * as repo from '../database/memoRepository';
import { CATEGORY, STATUS, type Category, type Status, type Priority } from '../constants/theme';

interface MemoState {
  memos: Memo[];
  filter: MemoFilter;
  loading: boolean;
  isDarkMode: boolean;

  loadMemos: () => Promise<void>;
  setFilter: (filter: MemoFilter) => Promise<void>;
  clearFilter: () => Promise<void>;
  addMemo: (data: { title: string; content: string; category: Category; priority: Priority; tags: string }) => Promise<void>;
  editMemo: (id: string, data: Partial<Omit<Memo, 'id' | 'created_at'>>) => Promise<void>;
  removeMemo: (id: string) => Promise<void>;
  toggleStatus: (id: string) => Promise<void>;
  setDarkMode: (dark: boolean) => void;
}

export const useMemoStore = create<MemoState>((set, get) => ({
  memos: [],
  filter: {},
  loading: false,
  isDarkMode: false,

  loadMemos: async () => {
    set({ loading: true });
    try {
      const memos = await repo.getAllMemos(get().filter);
      set({ memos });
    } finally {
      set({ loading: false });
    }
  },

  setFilter: async (filter) => {
    set({ filter });
    await get().loadMemos();
  },

  clearFilter: async () => {
    set({ filter: {} });
    await get().loadMemos();
  },

  addMemo: async (data) => {
    await repo.createMemo({
      title: data.title,
      content: data.content,
      category: data.category,
      priority: data.priority,
      status: STATUS.ACTIVE,
      tags: data.tags,
    });
    await get().loadMemos();
  },

  editMemo: async (id, data) => {
    await repo.updateMemo(id, data);
    await get().loadMemos();
  },

  removeMemo: async (id) => {
    await repo.deleteMemo(id);
    await get().loadMemos();
  },

  toggleStatus: async (id) => {
    const memo = await repo.getMemoById(id);
    if (memo) {
      const newStatus: Status = memo.status === STATUS.ACTIVE ? STATUS.COMPLETED : STATUS.ACTIVE;
      await repo.updateMemo(id, { status: newStatus });
      await get().loadMemos();
    }
  },

  setDarkMode: (dark) => {
    set({ isDarkMode: dark });
  },
}));
