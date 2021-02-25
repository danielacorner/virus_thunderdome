import React, { useEffect, useState } from "react";
import { useStore } from "./store";
import { Billboard, RoundedBox, Text } from "@react-three/drei";

export default function StartGameBillboard() {
  const worldRadius = useStore((s) => s.worldRadius);

  return (
    <Billboard
      position={[0, 0, -0.2]}
      args={[worldRadius / 1.2, worldRadius / 3]}
      material-color={"white"}
      material-opacity={0.6}
      material-transparent={true}
    >
      <group position={[0, 0, 0.25]}>
        <group position={[0, 0.35, 0]}>
          {/* Text https://github.com/protectwise/troika/tree/master/packages/troika-three-text */}
          <Text color="black" fontSize={0.3} letterSpacing={0.05}>
            Virus Thunderdome
          </Text>
        </group>
        <group position={[0, 0.05, 0]}>
          <Text color="black" fontSize={0.1}>
            Requirements: 50MB download, 1GB memory
          </Text>
        </group>
        <group position={[0, -0.4, 0]}>
          <BtnStartGame />
        </group>
      </group>
    </Billboard>
  );
}

function BtnStartGame() {
  const set = useStore((s) => s.set);

  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "auto";
  }, [hovered]);

  return (
    <mesh
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() =>
        set({
          started: true,
        })
      }
    >
      <RoundedBox position={[0, 0, -0.1]} radius={0.05} args={[1, 0.5, 0.1]}>
        <meshPhongMaterial attach="material" color="#f3f3f3" />
      </RoundedBox>
      <Text color="black" letterSpacing={0.05} fontSize={0.18}>
        START
      </Text>
    </mesh>
  );
}
