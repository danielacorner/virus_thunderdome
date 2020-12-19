/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
author: JuanGartner (https://sketchfab.com/JuanGartner)
license: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
source: https://sketchfab.com/models/1560a647337c4bd7b58e0e23fcce9cac
title: Antibody
*/

import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei/useGLTF";

export default function ModelAntibody(props) {
  const group = useRef();
  const { nodes, materials } = useGLTF("/models/antibody/scene.gltf") as any;
  return (
    <group ref={group} {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <group
          position={[0.02, 0.05, 0.04]}
          rotation={[0.53, 0.01, -1.19]}
          scale={[0.08, 0.08, 0.08]}
        >
          <mesh
            material={materials.surface}
            geometry={nodes.antibody_0.geometry}
          />
        </group>
        <group
          position={[4.08, 1.01, 5.9]}
          rotation={[-0.27, 0.6, 1.93]}
          scale={[1, 1, 1]}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/scene.gltf");
