import { PROTEINS } from "../utils/PROTEINS";
import { useSpringStoreImmediately } from "./useSpringAfterTimeout";

export const WAVES = [
  {
    virus: PROTEINS.viruses.find((v) => v.name === "Poliovirus"),
    numViruses: 10,
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
      return null;
    },
  },
  {
    virus: PROTEINS.viruses.find(
      (v) => v.name === "Human Papillomavirus (HPV)"
    ),
    numViruses: 12,
    Spring: null,
  },
];
