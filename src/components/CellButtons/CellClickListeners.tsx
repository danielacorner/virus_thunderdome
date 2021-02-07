import React, { useEffect, useState } from "react";
import { useStore } from "../../store";
import { useCellsFiltered } from "../useCellsFiltered";
import styled from "styled-components/macro";
import { ICONS, WAVES } from "../Game/WAVES";
import Block from "@material-ui/icons/GpsFixed";

export function CellClickListeners() {
  const cellsFiltered = useCellsFiltered();

  return (
    <>
      {cellsFiltered.map((cell, idx) => (
        <CellClickListener
          key={idx}
          {...{
            idx,
            numCells: cellsFiltered.length,
          }}
        />
      ))}
    </>
  );
}
const CELLS_GAP = 205;

function CellClickListener({ idx, numCells }) {
  const [isPointerDown, setIsPointerDown] = useState(false);
  const createAntibody = useStore((s) => s.createAntibody);
  const Icon = ICONS[idx];

  useEffect(() => {
    const antibody = WAVES[idx].antibody;
    let intervalCreateABs;
    if (isPointerDown) {
      createAntibody({ abData: antibody, iconIdx: idx });
      intervalCreateABs = window.setInterval(() => {
        createAntibody({ abData: antibody, iconIdx: idx });
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
      cellsGap={(CELLS_GAP * 2) / numCells}
      className={isPointerDown ? "active" : ""}
      {...{ idx, numCells }}
      onPointerDown={() => setIsPointerDown(true)}
      onPointerLeave={() => setIsPointerDown(false)}
      onPointerUp={() => setIsPointerDown(false)}
    >
      <div className="svgIcon">
        <Icon />
        <div className="blockIcon">
          <Block />
        </div>
      </div>
    </ClickListenerStyles>
  );
}

const ClickListenerStyles = styled.div`
  position: absolute;
  border: 1px solid #737373;
  box-shadow: 0px 2px 5px 1px #000000bd;
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  border-radius: 16px;
  .svgIcon {
    width: 100%;
    height: 100%;
    position: relative;
    svg {
      position: absolute;
      top: -18px;
      right: -18px;
      width: 36px;
      height: 36px;
    }
    .blockIcon {
      opacity: 0.3;
      svg {
        transform: scale(1.8);
      }
      color: red;
    }
  }
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
    50vw - 50px - ${(p) => p.cellsGap * (-p.idx + (p.numCells - 1) / 2)}px
  );
`;
