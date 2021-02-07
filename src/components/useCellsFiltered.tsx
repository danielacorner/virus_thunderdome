import { useStore } from "../store";
import { CELLS } from "./CellButtons/Cells";

export function useCellsFiltered() {
  const currentWave = useStore((s) => s.currentWave);
  const cellsFiltered = CELLS.filter(
    (_, idx) => idx === 0 || currentWave > idx
  );
  return cellsFiltered;
}
