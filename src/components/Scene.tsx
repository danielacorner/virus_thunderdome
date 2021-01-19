import React, { useEffect, useState } from "react";
import { Physics } from "@react-three/cannon";
import { useFrame } from "react-three-fiber";
import { OrbitControls } from "@react-three/drei";
import { Lighting } from "./Lighting";
import { Walls as Cube } from "./Walls";
import ProteinGroup from "./ProteinGroup";
import { PHYSICS_PROPS } from "../utils/PHYSICS_PROPS";
import { PROTEINS } from "../utils/PROTEINS";
import { Water } from "./Water";
import { ScaleIndicator } from "./ScaleIndicator";
import { SelectedParticleDisplay } from "./SelectedParticleDisplay";
import { useStore } from "../store";
import { useSpring } from "@react-spring/core";

const Scene = () => {
  // audio track
  // useAudioTrack();

  // useSetTemperatureLowInitially();
  return (
    <>
      <OrbitControls />
      <Lighting />
      <Physics {...PHYSICS_PROPS}>
        {PROTEINS.viruses.map((protein) => {
          return <ProteinGroup key={protein.name} {...protein} />;
        })}
        <Water />
        <Cube />
        <SelectedParticleDisplay />
        <ScaleIndicator />
        {/* <Cells /> */}
      </Physics>
      {/* <Effects /> */}
      <StorylineSequence />
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
  // first, animate the scale to 0.01
  useAnimateAfterTimeout2({
    startTime: 5000,
    endTime: 12000,
    target: 0.01,
    property: "scale",
  });

  // // first, animate the scale to 0.01
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

  return null;
}

/** animate a value to a target value over a certain time */
function useAnimateAfterTimeout({
  target,
  startTime,
  endTime,
  property,
}: {
  target: number;
  startTime: number;
  endTime: number;
  property: string;
}) {
  const set = useStore((s) => s.set);
  const current = useStore((s) => s[property]);

  const delta = (target - current) / 10; /* <- animation function */
  useFrame(({ clock }) => {
    const time = clock.elapsedTime * 1000 - clock.startTime;
    const shouldAnimate = clock.running && startTime < time && time < endTime;
    if (shouldAnimate) {
      const nextValue = target - delta;
      set({ [property]: nextValue });
    }
  });
}
/** animate a value to a target value over a certain time */
function useAnimateAfterTimeout2({
  target,
  startTime,
  endTime,
  property,
}: {
  target: number;
  startTime: number;
  endTime: number;
  property: string;
}) {
  const set = useStore((s) => s.set);
  const current = useStore((s) => s[property]);

  const [animating, setAnimating] = useState(false);

  // https://codesandbox.io/s/react-spring-v9-rc-6hi1y?file=/src/index.js:983-1012
  // Set up a shared spring which simply animates the toggle above
  // We use this spring to interpolate all the colors, position and rotations
  const { x } = useSpring({
    x: animating,
    config: { mass: 5, tension: 1000, friction: 50, precision: 0.0001 },
  });
  useEffect(() => {
    console.log("🌟🚨 ~ x", x);
    set({ [property]: x.to([0, 1], [current, target]) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [x]);

  useFrame(({ clock }) => {
    const time = clock.elapsedTime * 1000 - clock.startTime;
    const shouldAnimate = clock.running && startTime < time && time < endTime;
    if (!animating && shouldAnimate) {
      setAnimating(shouldAnimate);
    }
    // if (shouldAnimate) {
    //   const nextScale = target - delta;
    //   set({ scale: nextScale });
    // }
  });
}
