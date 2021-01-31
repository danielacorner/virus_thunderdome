import React, { ReactNode, useRef, useState } from "react";
import { useConvexPolyhedron } from "@react-three/cannon";
import { useJitterParticle } from "./useJitterParticle";
import { useStore } from "../../store";
import * as THREE from "three";
import { useChangeVelocityWhenTemperatureChanges } from "./useChangeVelocityWhenTemperatureChanges";
import { useMount } from "../../utils/utils";
import { useSpring, a } from "react-spring/three";
import { HighlightParticle } from "./HighlightParticle";
import { HTML } from "@react-three/drei";
import styled from "styled-components/macro";
import { Protein, PROTEIN_TYPES } from "../../utils/PROTEINS";

export type ParticleProps = Protein & {
  position: [number, number, number];
  Component: ReactNode;
  mass: number;
  numIcosahedronFaces: number;
  radius: number;
  interactive: boolean;
  unmount: Function;
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
function InteractiveParticle(props: ParticleProps) {
  const {
    position,
    Component,
    mass,
    numIcosahedronFaces,
    lifespan = null,
    unmount = () => {},
    name,
    type,
  } = props;

  // const set = useStore((s) => s.set);
  const scale = useStore((s) => s.scale);
  const isTooltipMaximized = useStore((s) => s.isTooltipMaximized);
  const selectedProtein = useStore((s) => s.selectedProtein);
  const isSelectedProtein =
    selectedProtein && selectedProtein.name === props.name;

  // each virus has a polyhedron shape, usually icosahedron (20 faces)
  // this shape determines how it bumps into other particles
  // https://codesandbox.io/s/r3f-convex-polyhedron-cnm0s?from-embed=&file=/src/index.js:1639-1642
  const detail = Math.floor(numIcosahedronFaces / 20); // 0 = icosahedron, 1 = 40 faces, etc...
  const volumeOfSphere = (4 / 3) * Math.PI * props.radius ** 3;
  const mockMass = 10 ** -5 * volumeOfSphere;

  const [ref, api] = useConvexPolyhedron(() => ({
    // TODO: accurate mass data from PDB --> need to multiply by number of residues or something else? doesn't seem right
    mass: mockMass, // approximate mass using volume of a sphere equation
    position,
    // https://threejs.org/docs/scenes/geometry-browser.html#IcosahedronBufferGeometry
    args: new THREE.IcosahedronGeometry(1, detail),
  }));

  const [isDecaying, setIsDecaying] = useState(false);

  // start decaying after lifespan elapses,
  // then unmount after lifespan+decay time
  useMount(() => {
    if (lifespan) {
      window.setTimeout(() => {
        setIsDecaying(true);
      }, lifespan);
    }
  });

  const springProps = useSpring({
    scale: [
      scale * (isDecaying ? 0 : 1),
      scale * (isDecaying ? 0 : 1),
      scale * (isDecaying ? 0 : 1),
    ],
    config: {
      mass: 20,
      tension: 30,
      friction: 20,
      clamp: true,
    },
    // unmount the particle when it's fully decayed
    onRest: (spring) => {
      const isDecayed = spring.scale[0] === 0;
      // TODO: if type === PROTEIN_TYPES.antibody
      // TODO: else if type === PROTEIN_TYPES.virus
      if (isDecayed) {
        unmount();
      }
    },
  });

  useJitterParticle({
    mass,
    ref,
    api,
  });

  // when temperature changes, change particle velocity
  useChangeVelocityWhenTemperatureChanges({ mass, api });

  // const handleSetSelectedProtein = () =>
  //   set({ selectedProtein: { ...props, api } });

  // const pointerDownTime = useRef(0);

  // ! disabled for game version
  // if we mousedown AND mouseup over the same particle very quickly, select it
  // const handlePointerDown = () => {
  //   pointerDownTime.current = Date.now();
  // };
  // const handlePointerUp = () => {
  //   const timeSincePointerDown = Date.now() - pointerDownTime.current;
  //   if (timeSincePointerDown < 300) {
  //     handleSetSelectedProtein();
  //   }
  // };

  return (
    <a.mesh
      ref={ref}
      scale={springProps.scale}
      // onPointerDown={handlePointerDown}
      // onPointerUp={handlePointerUp}
    >
      <meshStandardMaterial opacity={0.1} transparent={true} />
      {isSelectedProtein && !isTooltipMaximized ? <HighlightParticle /> : null}
      <Component />
      <HTMLInfo
        {...{
          name,
          lifespan,
          type,
        }}
      />
    </a.mesh>
  );
}

function HTMLInfo({ name, lifespan, type }) {
  const [mounted, setMounted] = useState(false);
  useMount(() => {
    setTimeout(() => {
      // timeout to ensure bar starts 100% width
      setMounted(true);
    }, 1);
  });

  return (
    <HTML>
      <HTMLInfoStyles {...{ mounted, lifespan, type }}>
        <div className="name">{name}</div>
        <div className="hpBar">
          <div className="hp"></div>
        </div>
      </HTMLInfoStyles>
    </HTML>
  );
}
const HTMLInfoStyles = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 0;
  .name {
    font-size: 8px;
    font-weight: bold;
    white-space: nowrap;
    text-shadow: 0px 0px 2px white, 0px 0px 6px white;
    padding-bottom: 0.5em;
    text-align: center;
  }
  .hpBar {
    width: 50px;
    height: 5px;
    outline: 1px solid grey;
    .hp {
      width: 100%;
      height: 100%;
      background: ${(p) =>
        p.type === PROTEIN_TYPES.antibody ? "cornflowerblue" : "limegreen"};
      transition: transform ${(p) => p.lifespan}ms linear;
      transform: scaleX(${(p) => (p.mounted ? 0 : 1)});
      transform-origin: left;
    }
  }
`;

/** hide particle if too big or too small */
export function useShouldRenderParticle(radius: number) {
  const scale = useStore((s) => s.scale);
  const worldRadius = useStore((s) => s.worldRadius);

  return getShouldRenderParticle(scale, radius, worldRadius);
}

const MIN_RADIUS = 5;
const MAX_RADIUS = 20;
export function getShouldRenderParticle(
  scale: number,
  radius: number,
  worldRadius: number
) {
  const particleSize = scale * radius;
  const tooBigToRender = particleSize > worldRadius / MIN_RADIUS;
  const tooSmallToRender = particleSize < worldRadius / MAX_RADIUS;
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
