import React, { ReactNode, useEffect, useRef, useState } from "react";
import { useConvexPolyhedron } from "@react-three/cannon";
import { useJitterParticle } from "../Shapes/useJitterParticle";
import { useStore } from "../../store";
import * as THREE from "three";
import { useChangeVelocityWhenTemperatureChanges } from "../Shapes/useChangeVelocityWhenTemperatureChanges";
import { useMount } from "../../utils/utils";
import { useSpring, a } from "react-spring/three";
import { HighlightParticle } from "../Shapes/HighlightParticle";
import { Protein, PROTEINS, PROTEIN_TYPES } from "../../utils/PROTEINS";
import { HTMLOverlay } from "./HTMLOverlay";

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

  // virus hp scales with radius (~= number of antibodies required to cover its surface)
  const initialHp = props.radius;
  const [virusHp, setVirusHp] = useState(initialHp);

  // decay the virus when hp runs out
  const isVirus = type === PROTEIN_TYPES.virus;
  useEffect(() => {
    if (isVirus && virusHp <= 0) {
      window.setTimeout(() => {
        setIsDecaying(true);
      }, 0);
    }
  }, [virusHp, isVirus]);

  const [ref, api] = useConvexPolyhedron(() => ({
    // TODO: accurate mass data from PDB --> need to multiply by number of residues or something else? doesn't seem right
    mass: mockMass, // approximate mass using volume of a sphere equation
    position,
    onCollide: handleCollide(unmount, setVirusHp),
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

  const virusHpPct = isVirus ? virusHp / initialHp : 0;

  return (
    <a.mesh
      ref={ref}
      scale={springProps.scale}
      name={name}
      // onPointerDown={handlePointerDown}
      // onPointerUp={handlePointerUp}
    >
      <meshStandardMaterial opacity={0.1} transparent={true} />
      {isSelectedProtein && !isTooltipMaximized ? <HighlightParticle /> : null}
      <Component />
      <HTMLOverlay
        {...{
          name,
          lifespan,
          type,
          virusHpPct,
        }}
      />
    </a.mesh>
  );
}

function handleCollide(
  unmount: Function,
  setVirusHp: React.Dispatch<React.SetStateAction<number>>
) {
  return (event) => {
    const { body, target } = event as any;

    // ignore water
    if (!body || !target || body.name === "Water" || target.name === "Water") {
      return;
    }

    // * if it's an antibody hitting a target virus,
    // destroy the antibody
    const thisComponentAntibody = PROTEINS.antibodies.find(
      (ab) => ab.name === target.name
    );
    const collisionTargetVirus = PROTEINS.viruses.find(
      (vr) => vr.name === body.name
    );
    const isAntibodyHittingItsVirus = Boolean(
      thisComponentAntibody && collisionTargetVirus
    );

    // * if it's a virus target hitting its antibody
    // lower the virus's hp
    const thisComponentVirus = PROTEINS.viruses.find(
      (ab) => ab.name === target.name
    );

    const collisionTargetAntibody = PROTEINS.antibodies.find(
      (vr) => vr.name === body.name
    );

    const isVirusHittingItsAntibody = Boolean(
      thisComponentVirus && collisionTargetAntibody
    );

    if (!isAntibodyHittingItsVirus && !isVirusHittingItsAntibody) {
      return;
    }

    const isAntibodyCollidingWithItsTargetVirus =
      thisComponentAntibody &&
      collisionTargetVirus &&
      thisComponentAntibody.virusTarget === collisionTargetVirus.name;

    const isVirusTargetCollidingWithItsAntibody =
      thisComponentVirus &&
      collisionTargetAntibody &&
      thisComponentVirus.name === collisionTargetAntibody.virusTarget;

    // if it's the antibody,
    if (isAntibodyCollidingWithItsTargetVirus) {
      // unmount the antibody
      setTimeout(() => {
        unmount();
      });
      // if it's the virus, ?
    } else if (isVirusTargetCollidingWithItsAntibody) {
      // decrease the virus's HP
      setTimeout(() => {
        setVirusHp((prev) => {
          return prev - 10;
        });
      });
    }
  };
}

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
