import { ReactNode } from "react";
import create from "zustand";
import { MAX_SCALE } from "./utils/constants";
import { Protein } from "./utils/PROTEINS";

type SelectedProtein = Protein & {
  position: [number, number, number];
  api: any;
};

type GlobalStateType = {
  /** radius of the cube container */
  worldRadius: number;
  /** number of the wave we're currently on */
  currentWave: number;
  /** to track whether the wave is completed */
  numDefeatedViruses: number;
  /** to track whether the wave is completed */
  incrementNumDefeatedViruses: () => any;
  /** temperature = particle velocity */
  temperature: number;
  /** modal version of tooltip */
  isTooltipMaximized: boolean;
  /** player HP, shows in the playerHpBar */
  playerHp: number;
  /** show/hide the HP bar & icons */
  showHp: boolean;
  /** are assets loading? */
  loading: boolean;
  /** has the app been started */
  started: boolean;
  /** is the game paused / temperature === 0 */
  paused: boolean;
  /** if a property in the store is animating e.g. scale, can turn things on/off */
  isPropertyAnimating: boolean;
  /** how high is the 3d container's ceiling */
  ceilingHeight: number;
  /** scale of the scene */
  scale: number;
  /** which virus do the produced antibodies target? */
  targetVirusIdx: number;
  /** which cell was clicked? determines how the antibodies spawn */
  cellButtonIdx: number;
  /** the viruses currently in the game (or already defeated/unmounted) */
  viruses: { virusData: Protein; iconIdx: number }[];
  /** the antibodies currently in the game (or already defeated/unmounted) */
  antibodies: { abData: Protein; iconIdx: number }[];
  /** the viruses currently in the game (or already defeated/unmounted) */
  createVirus: (newVir: { virusData: Protein; iconIdx: number }) => any;
  /** the antibodies currently in the game (or already defeated/unmounted) */
  createAntibody: (newAb: { abData: Protein; iconIdx: number }) => any;
  /** which protein was clicked on / displays the tooltip info */
  selectedProtein: null | SelectedProtein;
  /** which protein was clicked on / displays the tooltip info */
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
    isPropertyAnimating: false,
    targetVirusIdx: 0,
    cellButtonIdx: 0,
    viruses: [],
    antibodies: [],
    createVirus: (newVir) =>
      set((state) => ({ viruses: [...state.viruses, newVir] })),
    createAntibody: (newAb) =>
      set((state) => ({ antibodies: [...state.antibodies, newAb] })),
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
