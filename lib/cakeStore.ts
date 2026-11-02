import { create } from "zustand";

export type CakePhase =
  | "idle"
  | "wish"
  | "ready"
  | "blowing"
  | "dark"
  | "celebrating"
  | "cutting"
  | "done";

type CakeState = {
  phase: CakePhase;
  setPhase: (phase: CakePhase) => void;
};

export const useCakeStore = create<CakeState>((set) => ({
  phase: "idle",
  setPhase: (phase) => set({ phase }),
}));
