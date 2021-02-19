import React from "react";
import { Controls } from "react-three-gui";
import Scene from "./components/Scene/Scene";
import { useWindowSize } from "./utils/hooks";
import TopControls from "./components/Controls/TopControls";
import {
  VRCanvas,
  DefaultXRControllers,
  Interactive,
  Hands,
} from "@react-three/xr";

import SideControls from "./components/Controls/SideControls";
import { Box } from "@react-three/drei";

export default function CanvasAndScene({ renderProteins = true }) {
  const windowSize = useWindowSize();
  //  // This one makes the camera move in and out
  //  useFrame(({ clock, camera }) => {
  //   camera.position.z = 50 + Math.sin(clock.getElapsedTime()) * 30
  // })

  // player group contains camera and controllers that you can use to move player around

  // const { player } = useXR()

  // useEffect(() => {
  //   player.position.x += 5
  // }, [])
  return (
    <>
      <Controls.Provider>
        <VRCanvas
          // onCreated={({ gl }) => {
          //   gl.shadowMap.enabled = true;
          //   gl.shadowMap.type = THREE.PCFShadowMap;
          // }}
          // gl={{ antialias: false, alpha: false }}
          style={{ height: windowSize.height, width: windowSize.width }}
          // camera={{ fov: 75 /* position: INITIAL_CAMERA_POSITION */ }}
        >
          <Scene />
          <DefaultXRControllers />
          <Interactive
            onSelect={() => console.log("clicked!")}
            // onHover={() => setIsHo/* vered(true)}
            // onBlur={() => setIsHov */ered(false)}
          >
            <Box />
          </Interactive>
          <Hands />
        </VRCanvas>
      </Controls.Provider>
      {/* <HideHpControls /> */}
      <SideControls />
      <TopControls />
    </>
  );
}

// function HideHpControls() {
//   const set = useStore((s) => s.set);
//   const showHp = useStore((s) => s.showHp);
//   return (
//     <div style={{ position: "fixed", top: 6, right: 16 }}>
//       <IconButton onClick={() => set({ showHp: !showHp })}>
//         {showHp ? <Visibility /> : <VisibilityOff />}
//       </IconButton>
//     </div>
//   );
// }
