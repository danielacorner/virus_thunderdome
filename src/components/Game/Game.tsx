import React, { useRef, useState } from "react";
import { SingleParticleMounted } from "../particle/SingleParticleMounted";
import { useStore } from "../../store";
import { randBetween, useMount } from "../../utils/utils";
import { useEffectOnce } from "../../utils/hooks";
import { WAVES, Wave } from "./WAVES";
import { SHOT_TYPES } from "../CellAndAntibodyButtons/CellAndAntibodyButtons";
import { useFrame, useThree } from "react-three-fiber";

const VIRUS_SPAWN_START_DELAY = 1 * 1000;

/** Generates waves of viruses, and you click to create antibodies to defend against them */
export default function Game() {
  return (
    <>
      {/* <StorylineSequence {...{ setViruses }} /> */}
      <WavesOfVirusCreation />
      <Viruses />
      <Antibodies />
    </>
  );
}

function Viruses() {
  const viruses = useStore((s) => s.viruses);
  const worldRadius = useStore((s) => s.worldRadius);

  return (
    <>
      {viruses.map(({ virusData, iconIdx }, idx) => {
        const jitter = 1 * worldRadius;
        const x = randBetween(-jitter, jitter);
        const y = worldRadius * 2 - randBetween(0, jitter);
        const z = randBetween(-jitter, jitter);
        return (
          <SingleParticleMounted
            {...{
              ...virusData,
              iconIdx,
              position: [x, y, z],
              key: idx,
            }}
          />
        );
      })}
    </>
  );
}
function Antibodies() {
  const antibodies = useStore((s) => s.antibodies);
  const worldRadius = useStore((s) => s.worldRadius);
  const cellButtonIdx = useStore((s) => s.cellButtonIdx);
  const { getPosition } = SHOT_TYPES[cellButtonIdx];

  return (
    <>
      {antibodies.map(({ abData, iconIdx }, idx) => {
        const [x, y, z] = getPosition(worldRadius);
        return (
          <SingleParticleMounted
            {...{
              ...abData,
              iconIdx,
              position: [x, y, z],
              key: idx,
              // each antibody decomposes after a set amount of time
              lifespan: 3.5 * 1000,
            }}
          />
        );
      })}
    </>
  );
}

function WavesOfVirusCreation() {
  const currentWaveIdx = useStore((s) => s.currentWaveIdx);
  const wavesSoFar = WAVES.slice(0, currentWaveIdx);

  return (
    <>
      {wavesSoFar.map((waveProps, idx) => (
        <SingleWave key={idx} {...{ ...waveProps }} />
      ))}
    </>
  );
}

const APPEAR_INTERVAL = 1000;

/** perform all actions necessary for the wave e.g. spawn viruses, move camera */
function SingleWave({ viruses, moveCameraTo = null }: Wave) {
  const createVirus = useStore((s) => s.createVirus);
  const started = useStore((s) => s.started);
  const scale = useStore((s) => s.scale);
  const loading = useStore((s) => s.loading);
  const currentWaveIdx = useStore((s) => s.currentWaveIdx);
  const scaleTarget = WAVES[Math.max(0, currentWaveIdx - 1)].scaleTarget;
  const isScaleTarget = scale - scaleTarget <= 0.000000000000000002; // seems to be the final value for scale

  const isPropertyAnimating = useStore((s) => s.isPropertyAnimating);

  const readyToCreateViruses =
    started && !isPropertyAnimating && isScaleTarget && !loading;

  // start spawning the viruses when the wave and all animations are done
  useEffectOnce({
    callback: () => {
      viruses.forEach(
        ({ virus: { virusData, iconIdx }, numViruses }, virusIdx) => {
          [...Array(numViruses)].forEach((_, idx2) => {
            setTimeout(() => {
              createVirus({ virusData, iconIdx, id_str: `${Math.random()}` });
            }, virusIdx * 500 + (idx2 + 1) * APPEAR_INTERVAL + VIRUS_SPAWN_START_DELAY);
          });
        }
      );
    },
    shouldRun: readyToCreateViruses,
    dependencies: [readyToCreateViruses],
  });

  const [dollyFinished, setDollyFinished] = useState(false);

  return moveCameraTo && !dollyFinished ? (
    <DollyMoveCamera {...{ moveCameraTo, setDollyFinished }} />
  ) : null;
}

const ANIMATION_DURATION = 10 * 1000;
function DollyMoveCamera({ moveCameraTo, setDollyFinished }) {
  const [, , z2] = moveCameraTo;
  const now = useRef(Date.now());

  useFrame(({ clock, camera }) => {
    // const secondsElapsed = clock.getElapsedTime();
    const timeSinceMounted = Date.now() - now.current;
    const pctDone = timeSinceMounted / ANIMATION_DURATION;

    if (pctDone >= 1) {
      setDollyFinished(true);
      return;
    }

    const { z } = camera.position;
    const dz = z2 - z;

    camera.position.z = z + dz * pctDone;
  });

  return null;
}

/**
 * 1. the game starts at the antibody scale (0.03)
 * we practice making antibodies, and playing with the temperature
 * (they could come out of membrane transport proteins?)
 * we notice the antibodies each disappear after a certain time (with error bars)
 *
 * 2. the game scale out a bit (0.01), tiny viruses start appearing,
 * the antibodies attach to them (hp bars decrease)
 * when a virus is fully coated, becomes semi-transparent,
 * eventually it's cleaned up by a white blood cell
 *
 * 3. whenever a virus touches the cell membrane below, hp bar decreases? hardcore: 1-hit ko?
 *
 * 4. scale out more and repeat
 *
 */
export function StorylineSequence() {
  // 1. first, animate the scale to 0.01
  // useSpringStoreAfterTimeout({
  //   startTime: WAVES[0].startTime,
  //   // startTime: 60 * 1000,
  //   property: "scale",
  //   target: 0.01,
  //   springConfig: { mass: 1, tension: 170, friction: 50, precision: 0.0001 },
  // });

  // 2.1. animate the scale to 0.01
  // useSpringStoreAfterTimeout({
  //   startTime: WAVES[1].startTime,
  //   // startTime: 60 * 1000,
  //   property: "scale",
  //   target: 0.006,
  //   springConfig: { mass: 1, tension: 170, friction: 50, precision: 0.0001 },
  // });

  // animate something once after a timeout
  // useAnimateAfterTimeout({
  //   startTime: 5000,
  //   endTime: 12000,
  //   target: 0.01,
  //   property: "scale"
  // });
  // set something once after a timeout
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     set({ scale: 0.01 });
  //   }, 5000);
  //   return () => {
  //     clearTimeout(timer);
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [set]);

  return <></>;
}
