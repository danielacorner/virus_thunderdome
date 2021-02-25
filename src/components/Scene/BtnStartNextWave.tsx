import React, { useEffect, useState } from "react";
import { INITIAL_PLAYER_HP, useStore } from "../../store";
import { Button } from "@material-ui/core";
import {
  SpringScaleToTarget,
  SpringTemperatureToTarget,
  WAVES,
} from "../Game/WAVES";
import { Billboard, Text, useGLTF, useProgress } from "@react-three/drei";
import { Button3D } from "../../Button3D";

const WAVE_START_DELAY = 1 * 1000;

export function BtnStartNextWave() {
  const set = useStore((s) => s.set);
  const started = useStore((s) => s.started);
  const numDefeatedViruses = useStore((s) => s.numDefeatedViruses);
  const { active: loading } = useProgress();
  const currentWaveIdx = useStore((s) => s.currentWaveIdx);

  // when the wave ends, show the "next wave" button,
  const totalVirusesSoFar = useTotalVirusesSoFar();

  const isWaveComplete = useStore((s) => s.isWaveComplete);
  useEffect(() => {
    if (numDefeatedViruses === totalVirusesSoFar && !isWaveComplete) {
      console.log("🌟🚨 ~ useEffect ~ totalVirusesSoFar", totalVirusesSoFar);
      console.log("🌟🚨 ~ useEffect ~ numDefeatedViruses", numDefeatedViruses);
      setTimeout(() => {
        set({ isWaveComplete: true });
        // restore full HP
        set({ playerHp: INITIAL_PLAYER_HP });
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numDefeatedViruses, totalVirusesSoFar, set]);

  // stop showing "incoming!!" after a bit
  const [isWaveIncoming, setIsWaveIncoming] = useState(false);
  useEffect(() => {
    if (isWaveIncoming) {
      setTimeout(() => {
        setIsWaveIncoming(false);
      }, 3 * 1000);
    }
  }, [isWaveIncoming]);

  const worldRadius = useStore((s) => s.worldRadius);

  return !started || loading || !(isWaveComplete || isWaveIncoming) ? null : (
    <Billboard
      position={[0, 0, -0.2]}
      args={isWaveIncoming ? [0, 0] : [worldRadius, worldRadius]}
      material-opacity={0}
      material-transparent={true}
    >
      <group position={[0, 0, 0.1]}>
        {isWaveComplete ? (
          <>
            <NextWaveAssets />
            <Button3D
              onClick={() => {
                set({ currentWaveIdx: currentWaveIdx + 1 });
                set({ isWaveComplete: false });
                set({ waveStartTime: Date.now() });
                setIsWaveIncoming(true);
              }}
            >
              {currentWaveIdx === 0 ? "START" : "Next Wave"}
            </Button3D>
          </>
        ) : isWaveIncoming ? (
          <group>
            <Text color={"tomato"}>Wave {currentWaveIdx} Incoming!!</Text>
            <NextWaveSprings />
          </group>
        ) : null}
      </group>
    </Billboard>
  );
}

export function useTotalVirusesSoFar() {
  const currentWaveIdx = useStore((s) => s.currentWaveIdx);

  // complete the wave when we've defeated all viruses so far
  const wavesSoFar = WAVES.slice(0, currentWaveIdx);
  const totalVirusesSoFar = wavesSoFar.reduce(
    (acc, cur) => acc + cur.viruses.reduce((a, c) => c.numViruses + a, 0),
    0
  );
  return totalVirusesSoFar;
}

function NextWaveAssets() {
  const currentWaveIdx = useStore((s) => s.currentWaveIdx);
  const nextWave = WAVES[currentWaveIdx];

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
  const currentWaveIdx = useStore((s) => s.currentWaveIdx);
  const nextWave = WAVES[currentWaveIdx - 1];
  const { active: loading } = useProgress();

  // when assets are done loading, launch the spring after a short timeout (otherwise it gets blocked in production?)
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!ready && !loading) {
      setTimeout(() => {
        setReady(true);
      }, WAVE_START_DELAY);
    }
  }, [ready, loading]);

  if (!nextWave) {
    return null;
  }

  const { Spring, scaleTarget, temperatureTarget } = nextWave;

  // some waves animate properties in the store
  // like scale, wallHeight
  return (
    <>
      {ready && Spring ? <Spring /> : null}
      {ready && scaleTarget ? (
        <SpringScaleToTarget target={scaleTarget} />
      ) : null}
      {ready && temperatureTarget ? (
        <SpringTemperatureToTarget target={temperatureTarget} />
      ) : null}
    </>
  );
}
