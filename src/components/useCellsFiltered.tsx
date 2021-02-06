import { useStore } from "../store";
import { CELLS } from "./Cells";

export function useCellsFiltered() {
  const currentWave = useStore((s) => s.currentWave);
  const cellsFiltered = CELLS.filter(
    (_, idx) => idx === 0 || currentWave > idx
  );
  return cellsFiltered;
}
