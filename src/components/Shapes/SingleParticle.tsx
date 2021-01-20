import React, { ReactNode, useRef, useState } from "react";
import { useConvexPolyhedron } from "@react-three/cannon";
import { useJitterParticle } from "./useJitterParticle";
import { GlobalStateType, useStore } from "../../store";
import * as THREE from "three";
import { usePauseUnpause } from "./usePauseUnpause";
import { useChangeVelocityWhenTemperatureChanges } from "./useChangeVelocityWhenTemperatureChanges";
import { useMount } from "../../utils/utils";

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
  console.log("🌟🚨 ~ InteractiveParticle ~ props", props);
  const {
    position,
    Component,
    mass,
    numIcosahedronFaces,
    radius,
    lifespan = null,
  } = props;

  const set = useStore((s) => s.set);
  const scale = useStore((s) => s.scale);

  const shouldRender = useShouldRenderParticle(radius, lifespan);

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

  usePauseUnpause({
    api,
  });

  useJitterParticle({
    mass,
    ref,
    api,
  });

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

/** hide particle if too big or too small */
export function useShouldRenderParticle(
  radius: number,
  lifespan?: number | null
) {
  const scale = useStore((state: GlobalStateType) => state.scale);
  const worldRadius = useStore((state: GlobalStateType) => state.worldRadius);

  const [radiusRendered, setRadiusRendered] = useState(radius);

  // lifespan: set a decay timer on mount
  useMount(() => {
    console.log("🌟🚨 ~ useMount ~ lifespan", lifespan);
    if (lifespan) {
      window.setTimeout(() => {
        setRadiusRendered(0);
      }, lifespan);
    }
  });

  const tooBigToRender = scale * radiusRendered > worldRadius / 3;
  const tooSmallToRender = scale * radiusRendered < worldRadius / 20;
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
      renderOrder={3}
      ref={ref}
      scale={[scale, scale, scale]}
      position={position}
    >
      <Component />
    </mesh>
  );
}
