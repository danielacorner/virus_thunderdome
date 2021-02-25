import React, { useEffect, useState } from "react";
import { RoundedBox, Text } from "@react-three/drei";

export function Button3D({ onClick, children, TextProps = {}, BoxProps = {} }) {
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "auto";
  }, [hovered]);

  return (
    <mesh
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={onClick}
    >
      <RoundedBox
        position={[0, 0, -0.1]}
        radius={0.05}
        args={[1, 0.5, 0.1]}
        {...BoxProps}
      >
        <meshPhongMaterial attach="material" color="#f3f3f3" />
      </RoundedBox>
      <Text color="black" letterSpacing={0.05} fontSize={0.18} {...TextProps}>
        {children}
      </Text>
    </mesh>
  );
}
