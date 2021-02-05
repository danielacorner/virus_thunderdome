import React, { useEffect, useState } from "react";
import { INITIAL_PLAYER_HP, useStore } from "../store";
import styled from "styled-components/macro";
import { Button } from "@material-ui/core";
import { WAVES } from "./WAVES";
import { useGLTF } from "@react-three/drei";

export function BtnStartNextWave() {
  const set = useStore((s) => s.set);
  const started = useStore((s) => s.started);
  const currentWave = useStore((s) => s.currentWave);
  const numDefeatedViruses = useStore((s) => s.numDefeatedViruses);

  // when the wave ends, show the "next wave" button,
  const [isWaveComplete, setIsWaveComplete] = useState(true);

  // complete the wave when we've defeated all viruses so far
  const wavesSoFar = WAVES.slice(0, currentWave);
  const totalVirusesSoFar = wavesSoFar.reduce(
    (acc, cur) => acc + cur.numViruses,
    0
  );
  useEffect(() => {
    if (numDefeatedViruses === totalVirusesSoFar && !isWaveComplete) {
      setTimeout(() => {
        setIsWaveComplete(true);
        // restore full HP
        set({ playerHp: INITIAL_PLAYER_HP });
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numDefeatedViruses, totalVirusesSoFar, isWaveComplete]);

  // stop showing "incoming!!" after a bit
  const [isWaveIncoming, setIsWaveIncoming] = useState(false);
  useEffect(() => {
    if (isWaveIncoming) {
      setTimeout(() => {
        setIsWaveIncoming(false);
      }, 3 * 1000);
    }
  }, [isWaveIncoming]);

  return !started ? null : (
    <NextWaveStyles>
      {isWaveComplete ? (
        <>
          <NextWaveAssets />
          <Button
            style={{ padding: "0.25em 3em", pointerEvents: "auto" }}
            onClick={() => {
              set({ currentWave: currentWave + 1 });
              setIsWaveComplete(false);
              setIsWaveIncoming(true);
            }}
            variant="outlined"
          >
            Next Wave
          </Button>
        </>
      ) : isWaveIncoming ? (
        <div className="incomingText">Wave {currentWave} Incoming!!</div>
      ) : null}
    </NextWaveStyles>
  );
}
const NextWaveStyles = styled.div`
  font-size: 2em;
  color: #f0461b;
  .incomingText {
    white-space: nowrap;
    animation-name: appearDisappear;
    animation-duration: 0.8s;
    animation-iteration-count: infinite;
    animation-direction: alternate;
    animation-timing-function: cubic-bezier(0.55, 0.085, 0.68, 0.53);
  }
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  pointer-events: none;
  display: grid;
  place-items: center;

  @keyframes appearDisappear {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`;

function NextWaveAssets() {
  const currentWave = useStore((s) => s.currentWave);
  const nextWave = WAVES[currentWave];
  console.log("🌟🚨 ~ NextWaveAssets ~ nextWave", nextWave);
  if (nextWave.assets.length > 0) {
    nextWave.assets.forEach((assetPath) => {
      useGLTF.preload(assetPath);
    });
  }
  return null;
}
