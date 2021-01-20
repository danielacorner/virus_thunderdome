import React, { ReactNode, useEffect, useRef, useState } from "react";
import { useConvexPolyhedron } from "@react-three/cannon";
import { useJitterParticle } from "./useJitterParticle";
import { GlobalStateType, useStore } from "../../store";
import * as THREE from "three";
import { usePauseUnpause } from "./usePauseUnpause";
import { useChangeVelocityWhenTemperatureChanges } from "./useChangeVelocityWhenTemperatureChanges";
import { useMount } from "../../utils/utils";
import { usePrevious } from "../../utils/hooks";
import { CEILING_HEIGHT_MULTIPLIER } from "../Walls";

export type ParticleProps = {
  position: [number, number, number];
  Component: ReactNode;
  mass: number;
  numIcosahedronFaces: number;
  radius: number;
  interactive: boolean;
  lifespan?: number | null;
};

/** Particle which can interact with others, or not (passes right through them) */
export function SingleParticle(props: ParticleProps) {
  const Particle = props.interactive
    ? InteractiveParticle
    : NonInteractiveParticle;
  return <Particle {...props} />;
}
/** interacts with other particles using @react-three/cannon */
function InteractiveParticle(props) {
  const {
    position,
    Component,
    mass,
    numIcosahedronFaces,
    radius,
    lifespan = null,
  } = props;
  const prevPosition: any = usePrevious(position);

  const set = useStore((s) => s.set);
  const scale = useStore((s) => s.scale);

  const shouldRender = useShouldRenderParticle(radius);

  // each virus has a polyhedron shape, usually icosahedron (20 faces)
  // this shape determines how it bumps into other particles
  // https://codesandbox.io/s/r3f-convex-polyhedron-cnm0s?from-embed=&file=/src/index.js:1639-1642
  const detail = Math.ceil(numIcosahedronFaces / 20);
  const [ref, api] = useConvexPolyhedron(() => ({
    mass,
    position,
    // https://threejs.org/docs/scenes/geometry-browser.html#IcosahedronBufferGeometry
    args: new THREE.IcosahedronGeometry(1, detail),
  }));

  const [isOffscreen, setIsOffscreen] = useState(false);

  useLifespan(lifespan, setIsOffscreen, isOffscreen, api, ref, prevPosition);

  usePauseUnpause({
    api,
  });

  // ! conflicts with useLifespan()
  // useJitterParticle({
  //   mass,
  //   ref,
  //   api,
  // });

  // when temperature changes, change particle velocity
  useChangeVelocityWhenTemperatureChanges({ mass, api });

  const handleSetSelectedProtein = () =>
    set({ selectedProtein: { ...props, api } });

  return (
    <mesh
      // visible={shouldRender}
      ref={ref}
      scale={shouldRender ? [scale, scale, scale] : [0, 0, 0]}
      onPointerDown={handleSetSelectedProtein}
    >
      {shouldRender ? <Component /> : null}
    </mesh>
  );
}

/** lifespan: set a decay timer on mount (move off-screen to "unmount")
 * TODO: slow decay opacity out animation
 */
function useLifespan(
  lifespan: any,
  setIsOffscreen: React.Dispatch<React.SetStateAction<boolean>>,
  isOffscreen: boolean,
  api,
  ref: React.MutableRefObject<THREE.Object3D>,
  prevPosition: any
) {
  const worldRadius = useStore((state: GlobalStateType) => state.worldRadius);

  useMount(() => {
    if (lifespan) {
      window.setTimeout(() => {
        setIsOffscreen(true);
      }, lifespan);
    }
  });

  // remove or add the particle back
  const set = useStore((s) => s.set);
  useEffect(() => {
    console.log("🌟🚨 ~ useEffect ~ isOffscreen", isOffscreen);
    if (isOffscreen) {
      console.log("🌟🚨 ~ useEffect ~ api", api);
      console.log("🌟🚨 ~ useEffect ~ ref", ref);
      // need to take the lid off momentarily to achieve this?
      // TODO: make walls height ~infinite instead?
      // set({ isRoofOn: false });
      const ceilingHeight = worldRadius * CEILING_HEIGHT_MULTIPLIER;
      setTimeout(() => {
        api.position.set(
          Math.random() * 0.5,
          ceilingHeight,
          Math.random() * 0.5
        );
        api.velocity.set(0, 0, 0);
      }, 0);
      // setTimeout(() => {
      //   set({ isRoofOn: true });
      // }, 1);
    } else if (prevPosition?.[0]) {
      api.position.set(prevPosition[0], prevPosition[1], prevPosition[2]);
      // ? api.velocity.set(0, 0, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOffscreen]);
}

/** hide particle if too big or too small */
export function useShouldRenderParticle(radius: number) {
  const scale = useStore((state: GlobalStateType) => state.scale);
  const worldRadius = useStore((state: GlobalStateType) => state.worldRadius);

  const tooBigToRender = scale * radius > worldRadius / 3;
  const tooSmallToRender = scale * radius < worldRadius / 20;
  return !(tooBigToRender || tooSmallToRender);
}

/** doesn't interact with other particles (passes through them) */
function NonInteractiveParticle({
  pathToGLTF,
  mass,
  position,
  Component,
  numIcosahedronFaces,
  pathToImage,
}) {
  const ref = useRef();
  useJitterParticle({
    mass,
    ref,
  });
  const scale = useStore((state) => state.scale);

  return (
    <mesh
      frustumCulled={true}
      renderOrder={3}
      ref={ref}
      scale={[scale, scale, scale]}
      position={position}
    >
      <Component />
    </mesh>
  );
}
