import React from "react";
import { useStore } from "./store";
import { Billboard, Text } from "@react-three/drei";
import { Button3D } from "./Button3D";

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

  return (
    <Button3D
      onClick={() =>
        set({
          started: true,
        })
      }
    >
      START
    </Button3D>
  );
}
