import React, { useEffect, useState } from "react";
import { useStore } from "../../store";
import { useCellsFiltered } from "../useCellsFiltered";
import styled from "styled-components/macro";
import { ICONS, WAVES } from "../Game/WAVES";
import Block from "@material-ui/icons/GpsFixedTwoTone";
import { useSpring, animated } from "react-spring";

const ANTIBODY_BTN_WIDTH = 48;
const ANTIBODY_BTN_GAP = 240;
const CELLS_BTN_GAP = 198;
const CELL_BTN_WIDTH = 72;

export function CellClickListeners() {
  const cellsFiltered = useCellsFiltered();
  const numCells = cellsFiltered.length;
  const targetVirusIdx = useStore((s) => s.targetVirusIdx);
  const buttonGap = ANTIBODY_BTN_GAP / numCells;

  const springLeftRight = useSpring({
    left: `calc(
      50vw - ${ANTIBODY_BTN_WIDTH / 4}px -
        ${buttonGap * (-targetVirusIdx + (numCells - 1) / 2)}px
    )`,
    config: {
      tension: 270,
      mass: 0.7,
      friction: 17,
    },
  });

  return (
    <>
      <VirusTargetIconsStyles numCells={numCells}>
        <animated.div style={springLeftRight} className="blockIcon">
          <Block />
        </animated.div>
        {cellsFiltered.map((cell, idx) => (
          <VirusTargetIconButton
            key={idx}
            {...{
              idx,
              numCells,
            }}
          />
        ))}
      </VirusTargetIconsStyles>
      {cellsFiltered.map((cell, idx) => (
        <CellClickListener
          key={idx}
          {...{
            idx,
            numCells,
          }}
        />
      ))}
    </>
  );
}

function VirusTargetIconButton({ idx, numCells }) {
  const Icon = ICONS[idx];
  const targetVirusIdx = useStore((s) => s.targetVirusIdx);
  const set = useStore((s) => s.set);
  const active = targetVirusIdx === idx;
  return (
    <VirusTargetIconStyles
      onClick={() => (active ? null : set({ targetVirusIdx: idx }))}
      className={`svgIcon${active ? " active" : ""}`}
      buttonGap={ANTIBODY_BTN_GAP / numCells}
      numCells={numCells}
      idx={idx}
    >
      <div className="container">
        <Icon />
      </div>
    </VirusTargetIconStyles>
  );
}

const VirusTargetIconStyles = styled.div`
  position: absolute;
  left: calc(
    50vw - ${ANTIBODY_BTN_WIDTH / 2}px -
      ${(p) => p.buttonGap * (-p.idx + (p.numCells - 1) / 2)}px
  );
  bottom: 0px;
  border: 1px solid #737373;
  &.active {
    border: 1px solid #bbbbbb;
    box-shadow: 0px 2px 1px 1px #00000073;
    transform: translateY(4px);
  }
  box-shadow: 0px 2px 5px 1px #000000bd;
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  border-radius: 16px;
  background: #68d0cb2e;
  width: ${ANTIBODY_BTN_WIDTH}px;
  height: ${ANTIBODY_BTN_WIDTH}px;
  .container {
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
    svg {
      width: 36px;
      height: 36px;
    }
  }
`;

const VirusTargetIconsStyles = styled.div`
  position: relative;
  bottom: 112px;
  .blockIcon {
    bottom: 4px;
    z-index: 1;
    position: absolute;
    opacity: 0.4;
    svg {
      transform: scale(3.2);
    }
    color: red;
  }
`;

function CellClickListener({ idx, numCells }) {
  const [isPointerDown, setIsPointerDown] = useState(false);
  const createAntibody = useStore((s) => s.createAntibody);
  const targetVirusIdx = useStore((s) => s.targetVirusIdx);
  const set = useStore((s) => s.set);

  useEffect(() => {
    const antibody = WAVES[targetVirusIdx].antibody;
    let intervalCreateABs;
    if (isPointerDown) {
      createAntibody({ abData: antibody, iconIdx: targetVirusIdx });
      intervalCreateABs = window.setInterval(() => {
        createAntibody({ abData: antibody, iconIdx: targetVirusIdx });
      }, 100);
    }
    return () => {
      if (intervalCreateABs) {
        window.clearInterval(intervalCreateABs);
      }
    };
  }, [isPointerDown, createAntibody, targetVirusIdx, idx]);

  const buttonGap = (CELLS_BTN_GAP * 2) / numCells;
  const buttonPosition = -idx + (numCells - 1) / 2;
  return (
    <ClickListenerStyles
      offsetLeft={buttonGap * buttonPosition}
      className={isPointerDown ? "active" : ""}
      {...{ idx, numCells }}
      onPointerDown={() => {
        set({ cellButtonIdx: idx });
        setIsPointerDown(true);
      }}
      onPointerLeave={() => setIsPointerDown(false)}
      onPointerUp={() => setIsPointerDown(false)}
    />
  );
}

const ClickListenerStyles = styled.div`
  position: absolute;
  bottom: 18px;
  left: calc(50vw - ${CELL_BTN_WIDTH / 2}px - ${(p) => p.offsetLeft}px);
  border: 1px solid #737373;
  box-shadow: 0px 2px 5px 1px #000000bd;
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  border-radius: 16px;
  z-index: 1;
  width: ${CELL_BTN_WIDTH}px;
  height: ${CELL_BTN_WIDTH}px;
  background: #68d0cb2e;
  &.active {
    box-shadow: 0px 2px 1px 1px #000000bd;
    transform: translateY(4px);
  }
`;
