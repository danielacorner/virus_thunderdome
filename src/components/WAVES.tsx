import { Protein, PROTEINS } from "../utils/PROTEINS";
import { useSpringStoreImmediately } from "./useSpringAfterTimeout";

const antibody_hiv = PROTEINS.antibodies.find(
  (ab) => ab.name === "anti-HIV Antibody"
);
const antibody_hpv = PROTEINS.antibodies.find(
  (ab) => ab.name === "anti-HPV Antibody"
);
const antibody_herpes = PROTEINS.antibodies.find(
  (ab) => ab.name === "anti-Herpes Antibody"
);
const antibody_poliovirus = PROTEINS.antibodies.find(
  (ab) => ab.name === "anti-Poliovirus Antibody"
);
const Polio = PROTEINS.viruses.find((v) => v.name === "Poliovirus");
const HPV = PROTEINS.viruses.find(
  (v) => v.name === "Human Papillomavirus (HPV)"
);
const HIV = PROTEINS.viruses.find((v) => v.name === "HIV");
const Herpes = PROTEINS.viruses.find((v) => v.name === "Herpes");

type Wave = {
  virus: Protein;
  antibody: Protein;
  numViruses: number;
  Spring?: Function;
  assets: string[];
};

export const WAVES: Wave[] = [
  {
    // TODO: allow multiple virus types in a wave
    virus: Polio,
    antibody: antibody_poliovirus,
    numViruses: 8,
    assets: [
      "/models/cells/lymphocyte.glb",
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
    virus: HPV,
    antibody: antibody_hpv,
    numViruses: 9,
    assets: [
      "/models/cells/monocyte.glb",
      "/models/viruses/hpv_100.glb",
      "/models/antibodies/antibody_hpv_10.glb",
    ],
    Spring: () => {
      useSpringStoreImmediately({
        property: "scale",
        target: 0.004,
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
  {
    virus: Herpes,
    antibody: antibody_herpes,
    numViruses: 6,
    assets: [
      "/models/cells/monocyte.glb",
      "/models/viruses/hpv_100.glb",
      "/models/antibodies/antibody_hpv_10.glb",
    ],
    Spring: () => {
      return null;
    },
  },
  {
    virus: HIV,
    antibody: antibody_hiv,
    numViruses: 2,
    assets: [
      "/models/cells/monocyte.glb",
      "/models/viruses/HIV_200.glb",
      "/models/antibodies/antibody_hiv_10.glb",
    ],
    Spring: () => {
      useSpringStoreImmediately({
        property: "scale",
        target: 0.002,
        springConfig: {
          mass: 1,
          tension: 170,
          friction: 50,
          precision: 0.0001,
        },
      });
      useSpringStoreImmediately({
        property: "ceilingHeight",
        target: 32,
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
];
