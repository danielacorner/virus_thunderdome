import React, { useState } from "react";
import { Physics } from "@react-three/cannon";
import { OrbitControls } from "@react-three/drei";
import { Lighting } from "./Lighting";
import { Walls } from "./Walls";
// import ProteinGroup from "./ProteinGroup";
import { PHYSICS_PROPS } from "../utils/PHYSICS_PROPS";
import { PROTEINS } from "../utils/PROTEINS";
import { Water } from "./Water";
import { ScaleIndicator } from "./ScaleIndicator";
import { SelectedParticleDisplay } from "./SelectedParticleDisplay";
import Cells from "./Cells";
import { useSpringAfterTimeout } from "./useSpringAfterTimeout";
import { SingleParticleMounted } from "./particle/SingleParticleMounted";
import { useStore } from "../store";
import { useMount } from "../utils/utils";

const Scene = () => {
  // audio track
  // useAudioTrack();

  return (
    <>
      <OrbitControls />
      <Lighting />
      <Physics {...PHYSICS_PROPS}>
        {/* {PROTEINS.viruses.map((protein) => {
          return <ProteinGroup key={protein.name} {...protein} />;
        })} */}
        <Water />
        <Walls />
        <SelectedParticleDisplay />
        <ScaleIndicator />
        <Cells />
        <StorylineSequence />
      </Physics>
      {/* <Effects /> */}
    </>
  );
};

// PROTEINS.forEach(({ pathToGLTF }) => // useGLTF.preload(pathToGLTF));

export default Scene;

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
function StorylineSequence() {
  const worldRadius = useStore((s) => s.worldRadius);
  const [viruses, setViruses] = useState([]);
  const addVirus = (virus) => setViruses((prev) => [...prev, virus]);

  // first, animate the scale to 0.01
  useSpringAfterTimeout({
    startTime: 0.5 * 1000, // ! right away during development
    // startTime: 60 * 1000,
    property: "scale",
    target: 0.01,
    springConfig: { mass: 1, tension: 170, friction: 50, precision: 0.0001 },
  });

  // the first wave of viruses appear!
  // ? they appear one at a time, over a period of 1 minute
  const numViruses = 5;
  const poliovirus = PROTEINS.viruses.find((v) => v.name === "Poliovirus");
  // const herpesvirus = PROTEINS.viruses.find((v) => v.name === "Herpes");

  // they appear from the top
  const position = [0, worldRadius, 0];
  useMount(() => {
    [...Array(numViruses)].forEach((_, idx) => {
      setTimeout(() => {
        addVirus(poliovirus);
      }, (idx + 1) * 1000);
    });
  });

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

  return (
    <>
      {viruses.map((ab, idx) => (
        <SingleParticleMounted
          {...{
            ...ab,
            position,
            key: idx,
            // viruses don't decompose
            // lifespan: 5 * 1000,
          }}
        />
      ))}
    </>
  );
}
