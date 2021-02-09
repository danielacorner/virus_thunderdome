import { useStore } from "../store";
import { CELLS } from "./CellButtons/Cells";

export function useCellsFiltered() {
  const currentWaveIdx = useStore((s) => s.currentWaveIdx + 1);
  const cellsFiltered = CELLS.slice(0, currentWaveIdx);
  return /* process.env.NODE_ENV === "development" ? CELLS : */ cellsFiltered;
}
