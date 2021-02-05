import { Protein, PROTEINS } from "../utils/PROTEINS";
import { useSpringStoreImmediately } from "./useSpringAfterTimeout";

type Wave = {
  virus: Protein;
  numViruses: number;
  Spring: Function;
  assets: string[];
};

export const WAVES: Wave[] = [
  {
    virus: PROTEINS.viruses.find((v) => v.name === "Poliovirus"),
    numViruses: 6,
    assets: [
      "/models/viruses/poliovirus_50.glb",
      "/models/antibodies/antibody_poliovirus_10.glb",
    ],
    Spring: () => {
      useSpringStoreImmediately({
        property: "scale",
        target: 0.01,
        springConfig: {
          mass: 1,
          tension: 170,
          friction: 50,
          precision: 0.0001,
        },
      });
      useSpringStoreImmediately({
        property: "ceilingHeight",
        target: 16,
        springConfig: {
          mass: 1,
          tension: 170,
          friction: 10,
          precision: 0.0001,
        },
      });
      return null;
    },
  },
  {
    virus: PROTEINS.viruses.find(
      (v) => v.name === "Human Papillomavirus (HPV)"
    ),
    numViruses: 9,
    assets: [
      "/models/viruses/hpv_100.glb",
      "/models/antibodies/antibody_hpv_10.glb",
    ],
    Spring: () => {
      useSpringStoreImmediately({
        property: "scale",
        target: 0.005,
        springConfig: {
          mass: 1,
          tension: 170,
          friction: 50,
          precision: 0.0001,
        },
      });
      return null;
    },
  },
];
