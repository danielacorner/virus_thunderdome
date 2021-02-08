import React, { useEffect, useState } from "react";
import { INITIAL_PLAYER_HP, useStore } from "../../store";
import styled from "styled-components/macro";
import { Button } from "@material-ui/core";
import { WAVES } from "../Game/WAVES";
import { useGLTF, useProgress } from "@react-three/drei";

const WAVE_START_DELAY = 1 * 1000;

export function BtnStartNextWave() {
  const set = useStore((s) => s.set);
  const started = useStore((s) => s.started);
  const numDefeatedViruses = useStore((s) => s.numDefeatedViruses);
  const { active: loadingAssets } = useProgress();

  // when the wave ends, show the "next wave" button,
  const currentWave = useStore((s) => s.currentWave);
  const [isWaveComplete, setIsWaveComplete] = useState(true);

  // complete the wave when we've defeated all viruses so far
  const wavesSoFar = WAVES.slice(0, currentWave);
  const totalVirusesSoFar = wavesSoFar.reduce(
    (acc, cur) => acc + cur.viruses.reduce((a, c) => c.numViruses + a, 0),
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

  return !started || loadingAssets ? null : (
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
            {currentWave === 0 ? "Ready" : "Next Wave"}
          </Button>
        </>
      ) : isWaveIncoming ? (
        <>
          <div className="incomingText">Wave {currentWave} Incoming!!</div>
          <NextWaveSprings />
        </>
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

  if (!nextWave) {
    return;
  }

  const { assets } = nextWave;
  if (assets.length > 0) {
    nextWave.assets.forEach((assetPath) => {
      useGLTF.preload(assetPath);
    });
  }

  return null;
}

function NextWaveSprings() {
  const currentWave = useStore((s) => s.currentWave);
  const nextWave = WAVES[currentWave - 1];
  const { active: loadingAssets } = useProgress();

  // when assets are done loading, launch the spring after a short timeout (otherwise it gets blocked in production?)
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!ready && !loadingAssets) {
      setTimeout(() => {
        setReady(true);
      }, WAVE_START_DELAY);
    }
  }, [ready, loadingAssets]);

  if (!nextWave) {
    return null;
  }

  const { Spring } = nextWave;

  // some waves animate properties in the store
  // like scale, wallHeight
  return ready && Spring ? <Spring /> : null;
}
