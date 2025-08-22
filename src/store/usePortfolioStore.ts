import { create } from "zustand";

type State = {
  dedupe: boolean;
  setDedupe: (b: boolean) => void;
  lastRefreshed?: string;
};

export const usePortfolioStore = create<State>((set) => ({
  dedupe: false,
  setDedupe: (b) => set({ dedupe: b }),
}));