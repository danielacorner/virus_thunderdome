import React, { useEffect, useRef } from "react";
import { useStore } from "./store";
import { Slider, Typography, useMediaQuery } from "@material-ui/core";
import styled from "styled-components/macro";
import { ZoomOut, ZoomIn } from "@material-ui/icons";
import { getIsTouchDevice } from "./getIsTouchDevice";
import { MIN_SCALE, MAX_SCALE } from "./utils/constants";

export function ScaleControls() {
  const scale = useStore((s) => s.scale);
  const isTouchDevice = getIsTouchDevice();
  // const { active: loading } = useProgress();

  const isLandscape =
    useMediaQuery(`(orientation: landscape)`) && isTouchDevice;

  // remember the lowest scale we've hit so far
  const lowestSoFar = useRef(scale);
  useEffect(() => {
    lowestSoFar.current = Math.min(scale, lowestSoFar.current);
  }, [scale]);
  return (
    <ScaleControlsStyles isLandscape={isLandscape}>
      <Typography align="center" id="scale-slider" gutterBottom>
        Scale
      </Typography>
      <div className="grid">
        <div className="grid-item">
          <ZoomOut />
        </div>
        <div className="grid-item">
          <Slider
            // disabled={true}
            valueLabelDisplay="off"
            aria-labelledby="scale-slider"
            // onChange={(event, newValue) => {
            //   // prevent going any lower while loading (can still go higher)
            //   // because we start small and scale up, this ensures we load the minimum number of assets each time
            //   if (loading && newValue < lowestSoFar.current) {
            //     return;
            //   }
            //   set({ scale: newValue });
            // }}
            min={MIN_SCALE}
            step={0.00000001}
            scale={(x) => x ** 2}
            max={MAX_SCALE}
            value={scale}
          />
        </div>
        <div className="grid-item">
          <ZoomIn />
        </div>
      </div>
    </ScaleControlsStyles>
  );
}
const ScaleControlsStyles = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 1em;
  place-items: center;
  height: 100%;
  width: 100%;
  pointer-events: none;
  .grid {
    opacity: 0.3;
    display: grid;
    place-items: center;
    width: 100%;
    .grid-item {
      width: 100%;
    }
    grid-template-columns: auto 1fr auto;
    place-items: center;
    grid-gap: 1em;
  }
`;
