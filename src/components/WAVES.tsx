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
const antibody_faustovirus = PROTEINS.antibodies.find(
  (ab) => ab.name === "anti-Faustovirus Antibody"
);
const Polio = PROTEINS.viruses.find((v) => v.name === "Poliovirus");
const HPV = PROTEINS.viruses.find(
  (v) => v.name === "Human Papillomavirus (HPV)"
);
const HIV = PROTEINS.viruses.find((v) => v.name === "HIV");
const Herpes = PROTEINS.viruses.find((v) => v.name === "Herpes");
const Faustovirus = PROTEINS.viruses.find((v) => v.name === "Faustovirus");

type Wave = {
  viruses: { virus: Protein; numViruses: number }[];
  antibody: Protein;
  Spring?: Function;
  assets: string[];
};

export const WAVES: Wave[] = [
  {
    viruses: [{ numViruses: 8, virus: Polio }],
    antibody: antibody_poliovirus,
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
    viruses: [
      { numViruses: 4, virus: Polio },
      { numViruses: 8, virus: HPV },
    ],
    antibody: antibody_hpv,
    assets: [
      "/models/cells/monocyte.glb",
      "/models/viruses/hpv_100.glb",
      "/models/antibodies/antibody_hpv_10.glb",
    ],
    Spring: () => {
      useSpringStoreImmediately({
        property: "scale",
        target: 0.006,
        springConfig: {
          mass: 1,
          tension: 340,
          friction: 50,
          precision: 0.0001,
        },
      });
      return null;
    },
  },
  {
    viruses: [
      { numViruses: 4, virus: Polio },
      { numViruses: 4, virus: HPV },
      { numViruses: 8, virus: Herpes },
    ],
    antibody: antibody_herpes,
    assets: [
      "/models/cells/monocyte.glb",
      "/models/viruses/hpv_100.glb",
      "/models/antibodies/antibody_hpv_10.glb",
    ],
    Spring: () => {
      useSpringStoreImmediately({
        property: "scale",
        target: 0.0045,
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
    viruses: [
      { numViruses: 2, virus: Polio },
      { numViruses: 4, virus: HPV },
      { numViruses: 6, virus: Herpes },
      { numViruses: 8, virus: HIV },
    ],
    antibody: antibody_hiv,
    assets: [
      "/models/cells/monocyte.glb",
      "/models/viruses/HIV_200.glb",
      "/models/antibodies/antibody_hiv_10.glb",
    ],
    Spring: () => {
      useSpringStoreImmediately({
        property: "scale",
        target: 0.003,
        springConfig: {
          mass: 1,
          tension: 170,
          friction: 50,
          precision: 0.0001,
        },
      });
      useSpringStoreImmediately({
        property: "ceilingHeight",
        target: 24,
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
    viruses: [
      { numViruses: 8, virus: HIV },
      { numViruses: 8, virus: Faustovirus },
    ],
    antibody: antibody_faustovirus,
    assets: [
      "/models/cells/monocyte.glb",
      "/models/viruses/HIV_200.glb",
      "/models/antibodies/antibody_hiv_10.glb",
    ],
    Spring: () => {
      useSpringStoreImmediately({
        property: "scale",
        target: 0.003,
        springConfig: {
          mass: 1,
          tension: 170,
          friction: 50,
          precision: 0.0001,
        },
      });
      useSpringStoreImmediately({
        property: "ceilingHeight",
        target: 24,
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
