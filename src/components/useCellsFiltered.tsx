import { useStore } from "../store";
import { CELLS } from "./CellButtons/Cells";

export function useCellsFiltered() {
  const currentWaveIdx = useStore((s) => s.currentWaveIdx);
  const cellsFiltered = CELLS.filter(
    (_, idx) => idx === 0 || currentWaveIdx > idx
  );
  return process.env.NODE_ENV === "production" ? cellsFiltered : CELLS;
}
