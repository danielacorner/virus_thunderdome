import React from "react";
import { SingleParticleMounted } from "../particle/SingleParticleMounted";
import { useStore } from "../../store";
import { randBetween, useMount } from "../../utils/utils";
import { useEffectOnce } from "../../utils/hooks";
import { WAVES } from "./WAVES";

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

  return (
    <>
      {antibodies.map(({ abData, iconIdx }, idx) => {
        const [x, y, z] = getPosition({ worldRadius, cellButtonIdx });
        return (
          <SingleParticleMounted
            {...{
              ...abData,
              iconIdx,
              position: [x, y, z],
              key: idx,
              // each antibody decomposes after a set amount of time
              lifespan: 5 * 1000,
            }}
          />
        );
      })}
    </>
  );
}

function getPosition({ worldRadius, cellButtonIdx }) {
  let [x, y, z] = [0, 0, 0];

  if (cellButtonIdx === 0) {
    // first cell: spawns at completely random x z in the lower y section
    const jitter = 1 * worldRadius;
    x = randBetween(-jitter, jitter);
    z = randBetween(-jitter, jitter);
    y = -worldRadius + randBetween(worldRadius * 0.1, jitter);
  } else if (cellButtonIdx === 1) {
    // second cell: shoots up quickly
    // (spawns at smaller random x z in y=bottom, intersecting with floor to cause immediate jump)
    const jitter = 0.25 * worldRadius;
    x = randBetween(-jitter, jitter);
    z = randBetween(-jitter, jitter);
    y = -worldRadius;
  } else if (cellButtonIdx === 2) {
    // third cell: spawns in the corners => shoots towards the center
    x = worldRadius * (Math.random() > 0.5 ? 1 : -1);
    z = worldRadius * (Math.random() > 0.5 ? 1 : -1);
    y = -worldRadius;
  } else if (cellButtonIdx === 3) {
    // ? leaving 0,0,0 for now
  }

  return [x, y, z];
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

function SingleWave({ viruses }) {
  const createVirus = useStore((s) => s.createVirus);
  const started = useStore((s) => s.started);
  const scale = useStore((s) => s.scale);
  const loading = useStore((s) => s.loading);
  const currentWaveIdx = useStore((s) => s.currentWaveIdx);
  const scaleTarget = WAVES[currentWaveIdx].scaleTarget;
  const isScaleTarget = scale === scaleTarget;

  const isPropertyAnimating = useStore((s) => s.isPropertyAnimating);

  // start spawning the viruses when the wave and all animations are done
  useEffectOnce({
    callback: () => {
      viruses.forEach(
        ({ virus: { virusData, iconIdx }, numViruses }, virusIdx) => {
          [...Array(numViruses)].forEach((_, idx2) => {
            setTimeout(() => {
              createVirus({ virusData, iconIdx });
            }, virusIdx * 500 + (idx2 + 1) * APPEAR_INTERVAL + VIRUS_SPAWN_START_DELAY);
          });
        }
      );
    },
    shouldRun: started && !isPropertyAnimating && isScaleTarget && !loading,
    dependencies: [],
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
