import { useStore } from "../../store";
import { Protein, PROTEINS } from "../../utils/PROTEINS";
import { useSpringStoreImmediately } from "../useSpringAfterTimeout";
import { ReactComponent as Icon1 } from "./icons/virus_1.svg";
import { ReactComponent as Icon2 } from "./icons/virus_2.svg";
import { ReactComponent as Icon3 } from "./icons/virus_3.svg";
import { ReactComponent as Icon4 } from "./icons/virus_4.svg";
import { ReactComponent as Icon5 } from "./icons/virus_5.svg";

export const ICONS = [Icon1, Icon2, Icon3, Icon4, Icon5];

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
const Polio = {
  iconIdx: 0,
  virusData: PROTEINS.viruses.find((v) => v.name === "Poliovirus"),
};
const HPV = {
  iconIdx: 1,
  virusData: PROTEINS.viruses.find(
    (v) => v.name === "Human Papillomavirus (HPV)"
  ),
};
const Herpes = {
  iconIdx: 2,
  virusData: PROTEINS.viruses.find((v) => v.name === "Herpes"),
};
const HIV = {
  iconIdx: 3,
  virusData: PROTEINS.viruses.find((v) => v.name === "HIV"),
};
const Faustovirus = {
  iconIdx: 4,
  virusData: PROTEINS.viruses.find((v) => v.name === "Faustovirus"),
};

type Wave = {
  viruses: {
    virus: { virusData: Protein; iconIdx: number };
    numViruses: number;
  }[];
  antibody: Protein;
  scaleTarget?: number;
  Spring?: Function;
  assets: string[];
};

export const WAVES: Wave[] = [
  {
    viruses: [{ numViruses: 8, virus: Polio }],
    antibody: antibody_poliovirus,
    scaleTarget: 0.01,
    assets: [
      "/models/cells/lymphocyte.glb",
      "/models/viruses/poliovirus_50.glb",
      "/models/antibodies/antibody_poliovirus_10.glb",
    ],
    Spring: () => {
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
    scaleTarget: 0.006,
    Spring: () => {
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
    scaleTarget: 0.003,
    Spring: () => {
      return null;
    },
  },
  {
    viruses: [
      { numViruses: 2, virus: Polio },
      { numViruses: 3, virus: HPV },
      { numViruses: 3, virus: Herpes },
      { numViruses: 8, virus: HIV },
    ],
    antibody: antibody_hiv,
    assets: [
      "/models/cells/monocyte.glb",
      "/models/viruses/HIV_200.glb",
      "/models/antibodies/antibody_hiv_10.glb",
    ],
    scaleTarget: 0.0025,
    Spring: () => {
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
    scaleTarget: 0.0025,
    Spring: () => {
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

export function SpringScaleToTarget({ target }) {
  const setScale = useStore((s) => s.setScale);
  useSpringStoreImmediately({
    property: "scale",
    target: target,
    springConfig: {
      mass: 1,
      tension: 170,
      friction: 50,
      // precision: 0.0001,
    },
    setterFn: setScale,
  });
  return null;
}
