import { create } from "zustand";

type AppState = {
  leaderboardRange: "daily" | "weekly" | "all";
  pendingSubmission: boolean;
  setLeaderboardRange: (range: "daily" | "weekly" | "all") => void;
  setPendingSubmission: (value: boolean) => void;
};

type Setter = (partial: Partial<AppState>) => void;

const appStoreCreator = (set: Setter): AppState => ({
  leaderboardRange: "weekly",
  pendingSubmission: false,
  setLeaderboardRange: (leaderboardRange: AppState["leaderboardRange"]) => set({ leaderboardRange }),
  setPendingSubmission: (pendingSubmission: boolean) => set({ pendingSubmission }),
});

export const useAppStore = create<AppState>()(appStoreCreator);
