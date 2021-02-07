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
import Cells from "../CellButtons/Cells";
import Game from "./Game";

const Scene = () => {
  // audio track
  // useAudioTrack();

  return (
    <>
      <OrbitControls />
      <Lighting />
      <Physics {...PHYSICS_PROPS}>
        {/* {PROTEINS.viruses.map((protein) => {
          return <ProteinGroup key={protein.name} {...protein} />;
        })} */}
        <Water />
        <Walls />
        <SelectedParticleDisplay />
        <ScaleIndicator />
        <Cells />
        <Game />
      </Physics>
      {/* <Effects /> */}
    </>
  );
};

// PROTEINS.forEach(({ pathToGLTF }) => // useGLTF.preload(pathToGLTF));

export default Scene;
