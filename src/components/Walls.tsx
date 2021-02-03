import React, {useState} from "react";
import { useStore } from "../store";
import { PROTEINS } from "../utils/PROTEINS";
import { Plane } from "./Shapes/Plane";
import { useScalePercent } from "./useScalePercent";
import { usePlane } from "@react-three/cannon";
import { Html } from "@react-three/drei";
import styled from "styled-components/macro";

// const colors = niceColors[17];
const colors = ["#69d2e7", "#a7dbd8", "#e0e4cc", "#f38630", "#fa6900"];

export const CEILING_HEIGHT_MULTIPLIER = 4;

// https://www.npmjs.com/package/nice-color-palettes
// https://raw.githubusercontent.com/Jam3/nice-color-palettes/HEAD/visualize/1000.png
// const palette = niceColors[6]; // e.g. => [ "#69d2e7", "#a7dbd8", "#e0e4cc", "#f38630", "#fa6900" ]
export function Walls() {
  const worldRadius = useStore((state) => state.worldRadius);
  const ceilingHeight = worldRadius * CEILING_HEIGHT_MULTIPLIER;
  const walls = [
    {
      name: "in front",
      width: worldRadius * 2,
      height: ceilingHeight,
      rotation: [0 * Math.PI, 0, 0],
      color: colors[1],
      position: [0, ceilingHeight / 2 - worldRadius, -worldRadius],
    },
    {
      reflect: true,
      name: "behind", // (camera-side)
      width: worldRadius * 2,
      height: ceilingHeight,
      rotation: [0, -1 * Math.PI, 0],
      color: colors[1],
      position: [0, ceilingHeight / 2 - worldRadius, worldRadius],
    },
    {
      name: "left",
      width: worldRadius * 2,
      height: ceilingHeight,
      rotation: [0, 0.5 * Math.PI, 0],
      color: colors[1],
      position: [-worldRadius, ceilingHeight / 2 - worldRadius, 0],
    },
    {
      name: "right",
      width: worldRadius * 2,
      height: ceilingHeight,
      rotation: [0, -0.5 * Math.PI, 0],
      color: colors[2],
      position: [worldRadius, ceilingHeight / 2 - worldRadius, 0],
    },
    {
      name: "floor",
      width: worldRadius * 2,
      height: worldRadius * 2,
      rotation: [-0.5 * Math.PI, 0, 0],
      color: colors[1],
      position: [0, -worldRadius, 0],
    },
    {
      name: "ceiling",
      width: worldRadius * 2,
      height: worldRadius * 2,
      rotation: [0.5 * Math.PI, 0, 0],
      color: colors[1],
      position: [0, ceilingHeight - worldRadius, 0],
    },
  ];

  const scalePct = useScalePercent();

  return (
    <>
      {walls.map((props, idx) => (
        <Plane {...props} key={idx} />
      ))}
      <mesh>
        <icosahedronBufferGeometry args={[scalePct * 100, 5]} />
        <meshPhysicalMaterial
          color="rebeccapurple"
          opacity={0.018}
          transparent={true}
          depthTest={false}
          flatShading={true}
          roughness={0.4}
          vertexColors={true}
          reflectivity={1}
          wireframe={true}
        />
      </mesh>
      <InteractiveFloorWithHPIndicator
        {...{
          name: "floor",
          width: worldRadius * 2,
          height: worldRadius * 2,
          rotation: [-0.5 * Math.PI, 0, 0],
          // color: colors[1],
          position: [0, -worldRadius, 0],
        }}
      />
    </>
  );
}

function InteractiveFloorWithHPIndicator({
  width,
  height,
  widthSegments = 1,
  heightSegments = 1,
  reflect = false,
  ...rest
}) {
  const initialPlayerHp = 10000
  const [playerHp, setPlayerHp] = useState(initialPlayerHp)
  const [ref] = usePlane(() => ({
    // rotation: [-Math.PI / 2, 0, 0],
    ...rest,
    onCollide: (event) => {
      const { body:collidingBody, target:thisElement } = event as any;
      // if it's hit by a virus... derease hp
      const virusCollisionTarget = collidingBody.name&&PROTEINS.viruses.find(v=>v.name===collidingBody.name)
      if(virusCollisionTarget){
        setPlayerHp(prev=>prev-virusCollisionTarget.radius)
      }
    },
    // position: [-100, -100, -100],
  }));
  const playerHpPct = playerHp / initialPlayerHp
  return (
    <mesh ref={ref}>
      <planeGeometry
        attach="geometry"
        args={[width, height, widthSegments, heightSegments]}
      />
      <Html>
        <HPIndicatorStyles {...{playerHpPct}}>
          <div className="hpBar">
            <div className="hp"></div>
          </div>
        </HPIndicatorStyles>
      </Html>
    </mesh>
  );
}

const HPIndicatorStyles = styled.div`
  pointer-events: none;
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
    width: 240px;
    height: 8px;
    outline: 1px solid grey;
    .hp {
      width: 100%;
      height: 100%;
      background: limegreen;
      transition: transform 300ms linear;
      transform: scaleX(${(p) => p.playerHpPct});
      transform-origin: left;
    }
  }
`;
