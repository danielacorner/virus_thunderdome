import React, { useState } from "react";
import { PROTEINS } from "../utils/PROTEINS";
import { useSpringAfterTimeout } from "./useSpringAfterTimeout";
import { SingleParticleMounted } from "./particle/SingleParticleMounted";
import { useStore } from "../store";
import { useMount } from "../utils/utils";

export function StorylineAndIncomingViruses() {
  const [viruses, setViruses] = useState([]);
  const position = [0, 5 * 2, 0];
  return (
    <>
      <StorylineSequence {...{ setViruses }} />
      {viruses.map((ab, idx) => (
        <SingleParticleMounted
          {...{
            ...ab,
            position,
            key: idx,
          }}
        />
      ))}
    </>
  );
}

// const WAVES = [
//   {
//     startTime: 1 * 1000,
//     virus: PROTEINS.viruses.find((v) => v.name === "Poliovirus"),
//     numViruses: 10,
//   },
//   // {
//   //   startTime: 24 * 1000,
//   //   virus: PROTEINS.viruses.find(
//   //     (v) => v.name === "Human Papillomavirus (HPV)"
//   //   ),
//   //   numViruses: 12,
//   // },
// ];

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
export function StorylineSequence({ setViruses }) {
  const set = useStore((s) => s.set);
  const addVirus = (newVirus) => setViruses((p) => [...p, newVirus]);

  // // 1. first, animate the scale to 0.01
  // useSpringAfterTimeout({
  //   startTime: WAVES[0].startTime,
  //   // startTime: 60 * 1000,
  //   property: "scale",
  //   target: 0.01,
  //   springConfig: { mass: 1, tension: 170, friction: 50, precision: 0.0001 },
  // });

  // // viruses appear from the top
  // // 2. each wave of viruses appears in sequence!
  // // they appear one at a time, over a period of 1 minute
  // const APPEAR_INTERVAL = 2000;
  // useMount(() => {
  //   WAVES.forEach((wave, idx) => {
  //     setTimeout(() => {
  //       set({ currentWave: idx });
  //     }, wave.startTime);

  //     [...Array(wave.numViruses)].forEach((_, idx) => {
  //       setTimeout(() => {
  //         addVirus(wave.virus);
  //       }, wave.startTime + (idx + 1) * APPEAR_INTERVAL);
  //     });
  //   });
  // });

  // 2.1. animate the scale to 0.01
  // useSpringAfterTimeout({
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
