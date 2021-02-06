import React, { useEffect, useState } from "react";
import { useStore } from "../store";
import { useCellsFiltered } from "./useCellsFiltered";
import styled from "styled-components/macro";

export function CellClickListeners() {
  const cellsFiltered = useCellsFiltered();

  return (
    <>
      {cellsFiltered.map((cell, idx) => (
        <CellClickListener
          {...{ cell, idx, cellsFilteredLength: cellsFiltered.length }}
        />
      ))}
    </>
  );
}
function CellClickListener({ cell, idx, cellsFilteredLength }) {
  const [isPointerDown, setIsPointerDown] = useState(false);
  const createAntibody = useStore((s) => s.createAntibody);

  useEffect(() => {
    let intervalCreateABs;
    if (isPointerDown) {
      createAntibody(cell.antibody);
      intervalCreateABs = window.setInterval(() => {
        createAntibody(cell.antibody);
      }, 100);
    }
    return () => {
      if (intervalCreateABs) {
        window.clearInterval(intervalCreateABs);
      }
    };
  }, [isPointerDown, createAntibody, cell]);

  return (
    <ClickListenerStyles
      {...{ idx, cellsFilteredLength }}
      onPointerDown={() => setIsPointerDown(true)}
      onPointerLeave={() => setIsPointerDown(false)}
      onPointerUp={() => setIsPointerDown(false)}
    />
  );
}

const CELLS_GAP = 3;

const ClickListenerStyles = styled.div`
  position: absolute;
  border: 1px solid tomato;
  z-index: 1;
  width: 100px;
  height: 100px;
  bottom: 30px;
  left: calc(
    50vw - 50px -
      ${(p) => CELLS_GAP * (p.idx - (p.cellsFilteredLength - 1) / 2)}px
  );
`;
