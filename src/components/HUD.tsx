import { Scene, Matrix4 } from "three";
import React, { useRef, useMemo } from "react";
import { useFrame, useThree, createPortal } from "react-three-fiber";
import { OrthographicCamera, useCamera } from "@react-three/drei";
import { useControl } from "react-three-gui";

/** displays a set of 3d components in a fixed position based on Viewcube https://codesandbox.io/s/react-three-fiber-viewcube-py4db */
const HUD = ({ children, position }) => {
  const { gl, scene, camera } = useThree();
  const virtualScene = useMemo(() => new Scene(), []);
  const virtualCam = useRef();
  const ref = useRef(null as any);
  const matrix = new Matrix4();

  useFrame(() => {
    matrix.copy(camera.matrix).invert();
    ref.current?.quaternion.setFromRotationMatrix(matrix);
    gl.autoClear = true;
    gl.render(scene, camera);
    gl.autoClear = false;
    gl.clearDepth();
    gl.render(virtualScene, virtualCam.current);
  }, 1);
  const hudScale = useControl("HUDScale", {
    type: "number",
    min: 70,
    max: 500,
  });
  return createPortal(
    <>
      <OrthographicCamera
        ref={virtualCam}
        makeDefault={false}
        position={[0, 0, 0]}
      />
      <mesh
        ref={ref}
        raycast={useCamera(virtualCam)}
        position={[0, 0, 0]}
        scale={[hudScale, hudScale, hudScale]}
      >
        {children}
      </mesh>
      <pointLight position={position} intensity={2} />
    </>,
    virtualScene
  ) as any;
};

export default HUD;
