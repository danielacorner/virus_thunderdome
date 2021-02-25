import React, { Suspense, useEffect } from "react";
import Tooltip from "./components/SelectedParticle/SelectedParticleTooltip";
import { CanvasAndSceneEmpty } from "./CanvasAndSceneEmpty";
import { useStore } from "./store";
import { useMount } from "./utils/utils";
import { render } from "react-dom";
import MemoryStats from "react-memorystats";
import { CellAndAntibodyButtons } from "./components/CellAndAntibodyButtons/CellAndAntibodyButtons";
import { useLocalStorageState } from "./utils/useLocalStorageState";
import { AttributionLinks } from "./AttributionLinks";
import styled from "styled-components/macro";
function App() {
  useMount(() => {
    render(
      <MemoryStats corner="topLeft" />,
      document.getElementById("memoryStats")
    );
  });
  return (
    <div className="App">
      {/* <LoadingIndicator /> */}
      <LazyLoadedScene />
      <div id="memoryStats"></div>
      <Tooltip />
      <CellAndAntibodyButtons />
      {/* <GuidedTour /> */}
      <AttributionLinks />
      <SaveControlsSettingsToLocalStorage />
    </div>
  );
}

export default App;

const CanvasAndSceneLazy = React.lazy(() => import("./CanvasAndScene"));

function LazyLoadedScene() {
  const started = useStore((s) => s.started);

  return started ? (
    <Suspense fallback={null}>
      <CanvasAndSceneLazy />
    </Suspense>
  ) : (
    <>
      <CanvasAndSceneEmpty />
    </>
  );
}

export const StyledDiv = styled.div``;

function SaveControlsSettingsToLocalStorage() {
  const set = useStore((s) => s.set);
  const soundOn = useStore((s) => s.soundOn);

  const [settings, setSettings] = useLocalStorageState("settings", {
    soundOn,
  });

  // when app mounts, retrieve settings from local storage
  useMount(() => {
    if (!settings) {
      return;
    }
    if (settings.soundOn) {
      set({ soundOn: settings.soundOn });
    }
  });

  useEffect(() => {
    setSettings({ soundOn });
  }, [soundOn, setSettings]);

  return null;
}
