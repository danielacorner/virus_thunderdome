import create from "zustand";
import { MAX_SCALE } from "./utils/constants";
import { Protein } from "./utils/PROTEINS";

type SelectedProtein = Protein & {
  position: [number, number, number];
  api: any;
};

type GlobalStateType = {
  worldRadius: number;
  currentWave: number;
  numDefeatedViruses: number;
  incrementNumDefeatedViruses: () => any;
  temperature: number;
  isTooltipMaximized: boolean;
  playerHp: number;
  showHp: boolean;
  loading: boolean;
  started: boolean;
  paused: boolean;
  ceilingHeight: number;
  scale: number;
  selectedProtein: null | SelectedProtein;
  setSelectedProtein: (newSelectedProtein: null | SelectedProtein) => void;
  set: (newState: any) => any;
};

const startsStarted = /* false && */ process.env.NODE_ENV === "development";

export const INITIAL_PLAYER_HP = 10000;

// zustand https://github.com/pmndrs/zustand
// with typescript https://react-tracked.js.org/docs/tutorial-zustand-01/
export const useStore = create<GlobalStateType>(
  (set): GlobalStateType => ({
    isTooltipMaximized: false,
    paused: false,
    playerHp: INITIAL_PLAYER_HP,
    showHp: true,
    started: startsStarted,
    loading: !startsStarted,
    worldRadius: 5,
    currentWave: 0,
    numDefeatedViruses: 0,
    incrementNumDefeatedViruses: () =>
      set((state) => ({ numDefeatedViruses: state.numDefeatedViruses + 1 })),
    temperature: 1,
    ceilingHeight: 10,
    scale: MAX_SCALE,
    selectedProtein: null as null | SelectedProtein,
    setSelectedProtein: (selectedProtein) => set(() => ({ selectedProtein })),
    set: (newState) => set((state) => ({ ...state, ...newState })),
  })
);
