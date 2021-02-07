import React, { useEffect, useState } from "react";
import { useStore } from "../../store";
import { useCellsFiltered } from "../useCellsFiltered";
import styled from "styled-components/macro";
import { WAVES } from "../WAVES";

export function CellClickListeners() {
  const cellsFiltered = useCellsFiltered();

  return (
    <>
      {cellsFiltered.map((cell, idx) => (
        <CellClickListener
          key={idx}
          {...{
            idx,
            cellsFilteredLength: cellsFiltered.length,
          }}
        />
      ))}
    </>
  );
}
function CellClickListener({ idx, cellsFilteredLength }) {
  const [isPointerDown, setIsPointerDown] = useState(false);
  const createAntibody = useStore((s) => s.createAntibody);

  useEffect(() => {
    const antibody = WAVES[idx].antibody;
    let intervalCreateABs;
    if (isPointerDown) {
      createAntibody(antibody);
      intervalCreateABs = window.setInterval(() => {
        createAntibody(antibody);
      }, 100);
    }
    return () => {
      if (intervalCreateABs) {
        window.clearInterval(intervalCreateABs);
      }
    };
  }, [isPointerDown, createAntibody, idx]);

  return (
    <ClickListenerStyles
      className={isPointerDown ? "active" : ""}
      {...{ idx, cellsFilteredLength }}
      onPointerDown={() => setIsPointerDown(true)}
      onPointerLeave={() => setIsPointerDown(false)}
      onPointerUp={() => setIsPointerDown(false)}
    />
  );
}

const CELLS_GAP = 205;

const ClickListenerStyles = styled.div`
  position: absolute;
  border: 1px solid #737373;
  box-shadow: 0px 2px 5px 1px #000000bd;
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  border-radius: 16px;
  &.active {
    box-shadow: 0px 2px 1px 1px #000000bd;
    transform: translateY(4px);
  }
  z-index: 1;
  width: 100px;
  height: 100px;
  bottom: 30px;
  background: #68d0cb2e;

  left: calc(
    50vw - 50px -
      ${(p) => CELLS_GAP * (-p.idx + (p.cellsFilteredLength - 1) / 2)}px
  );
`;
