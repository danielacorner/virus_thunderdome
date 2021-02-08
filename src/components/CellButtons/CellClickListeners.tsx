import React, { useEffect, useState } from "react";
import { useStore } from "../../store";
import { useCellsFiltered } from "../useCellsFiltered";
import styled from "styled-components/macro";
import { ICONS, WAVES } from "../Game/WAVES";
import Block from "@material-ui/icons/GpsFixedTwoTone";
import { useSpring, animated } from "react-spring";
import { randBetween } from "../../utils/utils";

const ANTIBODY_BTN_WIDTH = 48;
const ANTIBODY_BTN_GAP = 240;
const CELLS_BTN_GAP = 198;
const CELL_BTN_WIDTH = 72;

export function CellClickListeners() {
  const cellsFiltered = useCellsFiltered();
  const numCells = cellsFiltered.length;
  const targetVirusIdx = useStore((s) => s.targetVirusIdx);
  const started = useStore((s) => s.started);
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

  return !started ? null : (
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
      {idx === 0 ? <div className="label">Antibodies</div> : null}
      <div className="container">
        <Icon />
      </div>
    </VirusTargetIconStyles>
  );
}

const VirusTargetIconStyles = styled.div`
  left: calc(
    50vw - ${ANTIBODY_BTN_WIDTH / 2}px -
      ${(p) => p.buttonGap * (-p.idx + (p.numCells - 1) / 2)}px
  );
  position: absolute;
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
  .label {
    pointer-events: none;
    position: absolute;
    transform: rotate(312deg);
    top: -3px;
    right: 45px;
    height: 100%;
    display: grid;
    place-items: center;
    font-size: 14px;
  }
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

const SPEED = 150;

export const SHOT_TYPES = [
  {
    absPerShot: 1,
    speed: 1 / SPEED,
    // quality: 1 / 1 == 1,
    getPosition: (worldRadius) => {
      // first cell: spawns at completely random x z in the lower y section
      const jitter = 1 * worldRadius;
      const x = randBetween(-jitter, jitter);
      const z = randBetween(-jitter, jitter);
      const y = -worldRadius + randBetween(worldRadius * 0.1, jitter);
      return [x, y, z];
    },
  },
  {
    absPerShot: 6,
    speed: 1 / (SPEED * 5.5),
    // quality: 6 / 5.5 == 1.09,
    getPosition: (worldRadius) => {
      // second cell: shoots up quickly
      // (spawns at smaller random x z in y=bottom, intersecting with floor to cause immediate jump)
      const jitter = 0.25 * worldRadius;
      const x = randBetween(-jitter, jitter);
      const z = randBetween(-jitter, jitter);
      const y = -worldRadius;
      return [x, y, z];
    },
  },
  {
    absPerShot: 2,
    speed: 1 / (SPEED * 1.6),
    // quality: 2 / 1.6 == 1.25,
    getPosition: (worldRadius) => {
      // third cell: spawns in the corners => shoots towards the center
      const x =
        worldRadius * (Math.random() > 0.5 ? 1 : -1) + randBetween(-0.1, 0.1);
      const z =
        worldRadius * (Math.random() > 0.5 ? 1 : -1) + randBetween(-0.1, 0.1);
      const y = -worldRadius;
      return [x, y, z];
    },
  },
  {
    absPerShot: 3,
    speed: 1 / (SPEED * 2),
    // quality: 3 / 2 == 1.5,
    getPosition: (worldRadius) => {
      const jitter = 0.3 * worldRadius;
      const x = randBetween(-jitter, jitter);
      const z = randBetween(-jitter, jitter);
      const y = -worldRadius + randBetween(0, -0.1 * worldRadius);
      return [x, y, z];
    },
  },
];

function CellClickListener({ idx, numCells }) {
  const [isPointerDown, setIsPointerDown] = useState(false);
  const createAntibody = useStore((s) => s.createAntibody);
  const targetVirusIdx = useStore((s) => s.targetVirusIdx);
  const cellButtonIdx = useStore((s) => s.cellButtonIdx);
  const isPropertyAnimating = useStore((s) => s.isPropertyAnimating);
  const set = useStore((s) => s.set);

  const { absPerShot, speed } = SHOT_TYPES[cellButtonIdx];

  useEffect(() => {
    const antibody = WAVES[targetVirusIdx].antibody;
    let intervalCreateABs;
    if (isPointerDown) {
      [...Array(absPerShot)].forEach(() => {
        createAntibody({ abData: antibody, iconIdx: targetVirusIdx });
      });
      intervalCreateABs = window.setInterval(() => {
        [...Array(absPerShot)].forEach(() => {
          createAntibody({ abData: antibody, iconIdx: targetVirusIdx });
        });
      }, 1 / speed);
    }
    return () => {
      if (intervalCreateABs) {
        window.clearInterval(intervalCreateABs);
      }
    };
  }, [isPointerDown, createAntibody, targetVirusIdx, idx, absPerShot, speed]);

  const buttonGap = (CELLS_BTN_GAP * 2) / numCells;
  const buttonPosition = -idx + (numCells - 1) / 2;
  return (
    <ClickListenerStyles
      offsetLeft={buttonGap * buttonPosition}
      className={
        isPropertyAnimating ? "disabled" : isPointerDown ? "active" : ""
      }
      {...{ idx, numCells }}
      onPointerDown={() => {
        set({ cellButtonIdx: idx });
        setIsPointerDown(true);
      }}
      onPointerLeave={() => setIsPointerDown(false)}
      onPointerUp={() => setIsPointerDown(false)}
    >
      {idx === 0 ? <div className="label">Immune Cells</div> : null}
    </ClickListenerStyles>
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
  &.disabled {
    background: #70908f;
    opacity: 0.5;
  }
  &.active {
    box-shadow: 0px 2px 1px 1px #000000bd;
    transform: translateY(4px);
  }
  .label {
    pointer-events: none;
    position: absolute;
    transform: rotate(312deg);
    top: -3px;
    right: 72px;
    height: 100%;
    display: grid;
    place-items: center;
    font-size: 14px;
  }
`;
