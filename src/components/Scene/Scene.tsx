import React from "react";
import { Physics } from "@react-three/cannon";
import { OrbitControls } from "@react-three/drei";
import { Lighting } from "./Lighting";
import { Walls } from "../Walls";
// import ProteinGroup from "./ProteinGroup";
import { PHYSICS_PROPS } from "../../utils/PHYSICS_PROPS";
import { Water } from "../Water";
import { ScaleIndicator } from "../Sliders/ScaleIndicator";
import { SelectedParticleDisplay } from "../SelectedParticle/SelectedParticleDisplay";
import CellsModels from "../CellAndAntibodyButtons/CellsModels";
import Game from "../Game/Game";
import { useAudioTrack } from "../music/useAudioTrack";

const Scene = () => {
  // audio track
  useAudioTrack();

  // useCameraWobble();
  return (
    <>
      <OrbitControls />
      <Lighting />
      <Physics {...PHYSICS_PROPS}>
        <Water />
        <Walls />
        <SelectedParticleDisplay />
        <ScaleIndicator />
        <CellsModels />
        <Game />
      </Physics>
      {/* <Effects /> */}
    </>
  );
};

// PROTEINS.forEach(({ pathToGLTF }) => // useGLTF.preload(pathToGLTF));

export default Scene;

// function useCameraWobble() {
//   useFrame(
//     ({
//       active,
//       aspect,
//       camera,
//       captured,
//       clock,
//       colorManagement,
//       concurrent,
//       events,
//       forceResize,
//       frames,
//       gl,
//       initialClick,
//       initialHits,
//       intersect,
//       invalidate,
//       invalidateFrameloop,
//       manual,
//       mouse,
//       noEvents,
//       pointer,
//       raycaster,
//       ready,
//       scene,
//       setDefaultCamera,
//       size,
//       subscribe,
//       subscribers,
//       viewport,
//       vr,
//     }) => {
//       const { x, y, z } = camera.position;
//       console.log("🌟🚨 ~ useCameraWobble ~ noise(1)", noise(1));
//       const jitter = 0.0000001;
//       const pb = perlinBetween(-jitter, jitter);
//       console.log("🌟🚨 ~ useCameraWobble ~ pb", pb);
//       camera.position.set(
//         x,
//         y,
//         z
//         // x + perlinBetween(-jitter, jitter),
//         // y + perlinBetween(-jitter, jitter),
//         // z + perlinBetween(-jitter, jitter)
//       );
//     }
//   );
// }

// function perlinBetween(min, max) {
//   return noise(max - min) + min;
// }
